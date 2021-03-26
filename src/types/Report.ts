import {TimeEntry} from "toggl-client";

export interface Report {
    entry: TimeEntry;
    estimate: number;
    day: string;
}
