export interface GenerateDescriptionOpts {
    description: string;
    taskPrefix: string;
    url: string;
}

export function generateDescriptionWithLink({description, taskPrefix, url}: GenerateDescriptionOpts): string {
    let desc: string;
    if (description.startsWith(`${taskPrefix}-`)) {
        const digRegex = new RegExp(`^(${taskPrefix}-\\d+)\\s`);
        const m = digRegex.exec(description);
        if (m) {
            desc = `<https://${url}/browse/${m[1]}|${m[1]}> ${description.replace(digRegex, '')}`;
        } else {
            desc = description;
        }
    } else {
        desc = description;
    }
    return ` • ${desc}`;
}
