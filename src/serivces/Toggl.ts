import {Report} from "../types/Report";
// @ts-ignore
import togglClient, {Project, TimeEntry} from 'toggl-client';
import moment from 'moment';

export interface GenerateReportsOpts {
    apiToken: string;
    clientId: number;
}

export async function generateReports({
    apiToken,
    clientId
                               }: GenerateReportsOpts): Promise<Report[]> {
    const toggl = togglClient({apiToken});
    const timeEntries = await toggl.timeEntries.list({
        start_date: moment().subtract(moment().day() === 1 ? 3 : 1, 'day').startOf('day').toISOString(),
        end_date: moment().subtract(1, 'day').endOf('day').toISOString(),
    });
    const projects = await toggl.clients.projects(clientId, true);
    const pids = projects.map((p: Project) => p.id);
    const report = timeEntries.filter((entry: TimeEntry) => entry.duration >= 60 * 5 && pids.includes(entry.pid));
    return report.map((entry: TimeEntry) => ({
        entry,
        estimate: Math.round((entry.duration / 60 / 60) * 2) / 2,
        day: moment(entry.start).format('dddd')
    }));
}
