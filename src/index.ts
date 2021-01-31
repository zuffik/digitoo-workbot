import dotenv from 'dotenv';
import {IncomingWebhook} from "@slack/webhook";
import {env} from "./env";
// @ts-ignore
import togglClient, {Project, TimeEntry} from 'toggl-client';
import moment from 'moment';
import _ from 'lodash';

interface Report {
    entry: TimeEntry;
    estimate: number;
    day: string;
}

async function generateReports(): Promise<Report[]> {
    const toggl = togglClient({apiToken: env.TOGGL_TRACK_TOKEN});
    const timeEntries = await toggl.timeEntries.list({
        start_date: moment().subtract(moment().day() === 1 ? 3 : 1, 'day').startOf('day').toISOString(),
        end_date: moment().subtract(1, 'day').endOf('day').toISOString(),
    });
    const clientId = parseInt(env.APP_REPORT_TOGGL_CLIENT_ID);
    const projects = await toggl.clients.projects(clientId, true);
    const pids = projects.map((p: Project) => p.id);
    const report = timeEntries.filter((entry: TimeEntry) => entry.duration >= 60 * 5 && pids.includes(entry.pid));
    return report.map((entry: TimeEntry) => ({
        entry,
        estimate: Math.round((entry.duration / 60 / 60) * 2) / 2,
        day: moment(entry.start).format('dddd')
    }));
}

async function run() {
    dotenv.config();
    const slack = new IncomingWebhook(env.SLACK_WEBHOOK_URL);
    const reports = await generateReports();
    /*const jira = new JiraApi({
        protocol: 'https',
        host: env.JIRA_URL,
        username: env.JIRA_USERNAME,
        password: env.JIRA_PASSWORD,
        apiVersion: '2',
        strictSSL: true
    });
    const user = await jira.getCurrentUser();*/
    const message = _.entries(_.groupBy(reports, 'day')).reduce((result, [day, reports]: [string, Report[]]) => {
        let r = `${result + day}: ~${reports.reduce((s, c) => s + c.estimate, 0)}h\n`;
        r += _.entries(_.groupBy(reports, r => r.entry.description)).map(([description, ]) => `• ${description}`).join('\n');
        return r + '\n';
    }, '');
    await slack.send(message);
}

run().catch(e => {
    console.error(e);
    process.exit(1);
})
