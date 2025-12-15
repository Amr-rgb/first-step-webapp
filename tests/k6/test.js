import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 10 },  // Ramp-up to 10 VUs
        { duration: '1m', target: 50 },   // Stay at 50 VUs
        { duration: '30s', target: 0 },   // Ramp-down
    ],
    thresholds: {
        http_req_failed: ['rate<0.05'], // <5% requests should fail
        http_req_duration: ['p(95)<2000'], // 95% of requests < 2s
    },
};

const urls = [
    'https://firststep-app.com/ar',
    'https://firststep-app.com/ar/services',
    'https://firststep-app.com/ar/nurseries',
    'https://firststep-app.com/ar/our-story',
    'https://firststep-app.com/ar/contact',
    'https://firststep-app.com/ar/blog',
    'https://firststep-app.com/ar/sign-up',
    'https://firststep-app.com/ar/sign-up/center',
    'https://firststep-app.com/ar/sign-up/parent',
    'https://firststep-app.com/ar/sign-in',
    'https://firststep-app.com/ar/forgot-password',
    'https://firststep-app.com/ar/privacy-policy',
    'https://firststep-app.com/ar/terms-conditions',
    'https://firststep-app.com/ar/coupon-codes',
    'https://firststep-app.com/ar/faqs',
    // Add English URLs
    'https://firststep-app.com/en',
    'https://firststep-app.com/en/services',
    'https://firststep-app.com/en/nurseries',
    'https://firststep-app.com/en/our-story',
    'https://firststep-app.com/en/contact',
    'https://firststep-app.com/en/blog',
    'https://firststep-app.com/en/sign-up',
    'https://firststep-app.com/en/sign-up/center',
    'https://firststep-app.com/en/sign-up/parent',
    'https://firststep-app.com/en/sign-in',
    'https://firststep-app.com/en/forgot-password',
    'https://firststep-app.com/en/privacy-policy',
    'https://firststep-app.com/en/terms-conditions',
    'https://firststep-app.com/en/coupon-codes',
    'https://firststep-app.com/en/faqs',
];

export default function () {
    for (const url of urls) {
        const res = http.get(url);

        check(res, {
            'status is 200': (r) => r.status === 200,
            'body is not empty': (r) => r.body.length > 0,
        });
        
        sleep(1); // 1s pause between requests to avoid instant spam
    }
}
