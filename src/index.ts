import dotenv from 'dotenv';
import {env} from "./env";
import {generateReports} from "./serivces/Toggl";
import {sendReports} from "./serivces/Slack";


async function run() {
    dotenv.config();
    const reports = await generateReports({
        apiToken: env.TOGGL_TRACK_TOKEN,
        clientId: parseInt(env.TOGGL_CLIENT_ID)
    });
    if (reports.length === 0) return;
    await sendReports(reports, {
        taskPrefix: env.JIRA_TASK_PREFIX,
        taskUrl: env.JIRA_URL,
        webhookUrl: env.SLACK_WEBHOOK_URL
    });
}

run().catch(e => {
    console.error(e);
    process.exit(1);
})
