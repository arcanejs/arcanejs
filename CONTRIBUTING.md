### Install

We use `pnpm` for package and workspace management,
running this from within any directory should install packages
for the whole monorepo.

```
pnpm install
```

You can add dependencies to specific packages in the monorepo by running
`pnpm install` commands from within the relevant packages.

### Build

To build all apps and packages, run the following command:

```
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
pnpm dev
```

Note that if you are running the example projects,
these do not support being run in dev mode,
and need to have their relevant `start` commands restarted.

### Changes

We use changeset to manage changelogs and releases,
if you make a change to any code,
before opening a PR make sure you run the following,
and check-in any files generated:

```
pnpm changeset
```
