export interface Env {
    SLACK_APP_ID: string;
    SLACK_CLIENT_ID: string;
    SLACK_CLIENT_SECRET: string;
    SLACK_SIGNING_SECRET: string;
    SLACK_WEBHOOK_URL: string;

    JIRA_URL: string;
    JIRA_USERNAME: string;
    JIRA_PASSWORD: string;

    TOGGL_TRACK_TOKEN: string;

    APP_REPORT_TOGGL_CLIENT_ID: string;
}

export interface ProcessEnv extends NodeJS.ProcessEnv, Env {
}

export const env: ProcessEnv = process.env as ProcessEnv;
