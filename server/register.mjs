// server/register.mjs
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import tsConfigPaths from 'tsconfig-paths';

// Register TypeScript paths
tsConfigPaths.register({
    baseUrl: './server',
    paths: {
        '*': ['*'],
    },
});

// Register .ts extension handler
register('@swc/register', pathToFileURL('./'));
