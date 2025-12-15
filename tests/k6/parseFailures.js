const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'results.json');

const failedRequests = {};

// Read the JSON file line by line
const lines = fs.readFileSync(filePath, 'utf-8').split('\n');

lines.forEach(line => {
    if (!line) return;
    try {
        const obj = JSON.parse(line);
        if (obj.metric === 'http_req_failed' && obj.data.value > 0) {
            const url = obj.data.tags.url || 'unknown';
            if (!failedRequests[url]) {
                failedRequests[url] = 0;
            }
            failedRequests[url] += obj.data.value;
        }
    } catch (err) {
        console.error('Error parsing line:', err);
    }
});

console.log('Failed Requests Summary:');
Object.entries(failedRequests).forEach(([url, count]) => {
    console.log(`${url} → Failed ${count} times`);
});

if (Object.keys(failedRequests).length === 0) {
    console.log('No failed requests detected.');
}
