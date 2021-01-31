declare module "toggl-client" {
    export interface TimeEntry {
        id: number;
        guid: string;
        wid: number;
        pid: number;
        billable: boolean;
        start: string;
        stop: string;
        duration: number;
        description: string;
        duronly: boolean;
        at: string;
        uid: number;
    }

    export interface Client {
        id: number;
        wid: number;
        name: string;
        notes: string;
        at: string;
    }

    export interface Project {
        id: number;
        wid: number;
        cid: number;
        name: string;
        billable: boolean;
        is_private: boolean;
        active: boolean;
        at: string;
    }

    export interface TogglClient {
        timeEntries: {
            list(query?: {
                start_date?: string,
                end_date?: string,
            }): Promise<TimeEntry[]>;
        }
        clients: {
            list(query?: any): Promise<Client[]>;
            projects(id: string | number, active?: boolean): Promise<Project[]>
        }
    }
    export default function (opts: {apiToken: string}): TogglClient;
}
