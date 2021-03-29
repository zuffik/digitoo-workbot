import {Report} from "../types/Report";
import _ from "lodash";
import {generateDescriptionWithLink} from "./Jira";
import {IncomingWebhook} from "@slack/webhook";

export interface GenerateMessagesFromReportsOpts {
    taskPrefix: string;
    taskUrl: string;
}

export function generateMessageFromReports(reports: Report[], opts: GenerateMessagesFromReportsOpts) {
    return _.entries(_.groupBy(reports, 'day')).reduce((result, [day, reports]: [string, Report[]]) => {
        let r = `${result + '*' + day}:* ~${reports.reduce((s, c) => s + c.estimate, 0)}h\n`;
        r += _.entries(_.groupBy(reports, r => r.entry.description)).map(([description,]) => generateDescriptionWithLink({
            description,
            taskPrefix: opts.taskPrefix,
            url: opts.taskUrl
        })).join('\n');
        return r + '\n';
    }, '');
}

export interface SendReportsOpts extends GenerateMessagesFromReportsOpts {
    webhookUrl: string;
}

export async function sendReports(reports: Report[], opts: SendReportsOpts) {
    const slack = new IncomingWebhook(opts.webhookUrl);
    const message = generateMessageFromReports(reports, {
        taskUrl: opts.taskUrl,
        taskPrefix: opts.taskPrefix,
    })
    await slack.send(message);
}
