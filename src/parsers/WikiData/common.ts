export function getObjectFromLuaString(input: string) {
        let result = input.replace(/(--.*|return )/gi, '');
        result = result.replace(/\["(.*?)"]\s*=/gi, '"$1": ');
        result = result.replace(/,\s*}/gi, '}');
        result = result.replace(/\{(("([^"]+?)",?\s*)+)}/gi, '[$1]');
        return JSON.parse(result);
}
