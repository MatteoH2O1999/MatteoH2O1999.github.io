import { TestEnvironment as JSDOMEnv } from 'jest-environment-jsdom';

class TestEnv extends JSDOMEnv {
    async setup() {
        await super.setup()
        if (this.global.TextDecoder === undefined && this.global.TextEncoder === undefined) {
            this.global.TextDecoder = TextDecoder;
            this.global.TextEncoder = TextEncoder;
        }
    }
};

export default TestEnv;