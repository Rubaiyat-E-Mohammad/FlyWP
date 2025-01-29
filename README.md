
## Pre-requisites

### Install Node.js

* Follow [instructions on the node.js site](https://nodejs.org/en/download/) to install Node.js.

### Install NVM

* Follow instructions in the [NVM repository](https://github.com/nvm-sh/nvm) to install NVM.

## Running tests:

#### Pre work for running the tests,

Clone this repository

- `git clone https://github.com/Rat01047/flywp-automation.git`

Run the followings in a terminal/command line window

```bash
cd e2e
```

- `npm install` to install the required dependencies (@playwright/test, dotenv, @faker-js/faker)

Make a .env file according to .env.example file

### How to run tests

To run the tests suite, use the following command:

```bash
npx playwright test
```
----------

### Additional Scripts:
<details><summary> ... </summary>
 
Here are some other useful commands to help you run and manage your tests effectively:

##### **Run All Tests**

Run all tests with optimal performance using the available workers:

```
npm run all
```

##### **Run All Tests in Headed Mode**

Run all tests in a browser with a visible UI and single worker:

##### **Run all tests,**

```
npm run all:headed
```

##### **Run Specific Shards,**

Playwright supports test sharding for parallel execution. You can run specific shards as follows:

• **Pre-shard tests,**

```
npm run test:preShard
```

• **Shard 1,**

```
npm run test:shard1
```

• **Shard 2,**

```
npm run test:shard2
```

• **Shard 3,**

```
npm run test:shard3
```

• **Post-shard tests,**

```
npm run test:postShard
```

##### **Run All Sharded Tests Sequentially**

Run pre-shard, all shards, and post-shard tests in sequence:

```
npm run test:sharded
```
</details>


----

### Generate and View Test Coverage:

<details><summary> ... </summary>

Generate coverage reports for your tests:

```
npm run test:coverage
```

##### **Generate and View HTML Reports,**

Merge reports from all shards and generate an HTML report:

```
npm run generate-report
```

##### **View the Latest Test Report,**

View the most recent HTML report:

```
npm run report
```
</details>

----------
### Notes:
</details><details><summary> ... </summary>

• Ensure all dependencies are installed before running these commands (npm install).

• Configure your test environment and projects in the Playwright configuration file (playwright.config.js).

</details>

