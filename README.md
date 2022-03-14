# Findlogs 🔎

</br>

## A simple CLI tool for locating stray console.log statements

</br>

[View NPM package ](https://www.npmjs.com/package/findlogs)

[View on Github ](https://github.com/duckRabbitPy/findlogs)

</br>

## How to install:

</br>

First run:

```shell
npm install findlogs
```

Then run:

```shell
npm link
```

or

```shell
npm link findlogs
```

</br>

### How to use:

cd into the directory you wish to search. The search is recursive and will explore all sub-directories excluding node_modules.

```shell
cd myFolder
```

```shell
findlogs
```

</br>

#### Output:

```shell
❯ findlogs
🔎 Found  3 console.logs in index.js
```
