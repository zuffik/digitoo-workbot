export interface Env {
    SLACK_WEBHOOK_URL: string;
    TOGGL_TRACK_TOKEN: string;
    TOGGL_CLIENT_ID: string;
    JIRA_TASK_PREFIX: string;
    JIRA_URL: string;
}

export interface ProcessEnv extends NodeJS.ProcessEnv, Env {
}

export const env: ProcessEnv = process.env as ProcessEnv;
