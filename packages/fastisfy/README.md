
fastisfy
=================

A fast and simple framework for building REST APIs with Fastify using filesystem routing. TypeScript support is built-in.

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @rromadhoni/fastisfy
$ fastisfy COMMAND
running command...
$ fastisfy (--version)
@rromadhoni/fastisfy/0.1.0 linux-x64 node-v16.18.1
$ fastisfy --help [COMMAND]
USAGE
  $ fastisfy COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fastisfy dev`](#fastisfy-dev)
* [`fastisfy help [COMMAND]`](#fastisfy-help-command)
* [`fastisfy plugins`](#fastisfy-plugins)
* [`fastisfy plugins:install PLUGIN...`](#fastisfy-pluginsinstall-plugin)
* [`fastisfy plugins:inspect PLUGIN...`](#fastisfy-pluginsinspect-plugin)
* [`fastisfy plugins:install PLUGIN...`](#fastisfy-pluginsinstall-plugin-1)
* [`fastisfy plugins:link PLUGIN`](#fastisfy-pluginslink-plugin)
* [`fastisfy plugins:uninstall PLUGIN...`](#fastisfy-pluginsuninstall-plugin)
* [`fastisfy plugins:uninstall PLUGIN...`](#fastisfy-pluginsuninstall-plugin-1)
* [`fastisfy plugins:uninstall PLUGIN...`](#fastisfy-pluginsuninstall-plugin-2)
* [`fastisfy plugins update`](#fastisfy-plugins-update)
* [`fastisfy start`](#fastisfy-start)

## `fastisfy dev`

Run the development server

```
USAGE
  $ fastisfy dev [-h] [-p <value>]

FLAGS
  -h, --help          Show CLI help.
  -p, --port=<value>  [default: 3000] port to listen on

DESCRIPTION
  Run the development server
```

## `fastisfy help [COMMAND]`

Display help for fastisfy.

```
USAGE
  $ fastisfy help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for fastisfy.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.20/src/commands/help.ts)_

## `fastisfy plugins`

List installed plugins.

```
USAGE
  $ fastisfy plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ fastisfy plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.9/src/commands/plugins/index.ts)_

## `fastisfy plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ fastisfy plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ fastisfy plugins add

EXAMPLES
  $ fastisfy plugins:install myplugin 

  $ fastisfy plugins:install https://github.com/someuser/someplugin

  $ fastisfy plugins:install someuser/someplugin
```

## `fastisfy plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ fastisfy plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ fastisfy plugins:inspect myplugin
```

## `fastisfy plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ fastisfy plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ fastisfy plugins add

EXAMPLES
  $ fastisfy plugins:install myplugin 

  $ fastisfy plugins:install https://github.com/someuser/someplugin

  $ fastisfy plugins:install someuser/someplugin
```

## `fastisfy plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ fastisfy plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ fastisfy plugins:link myplugin
```

## `fastisfy plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ fastisfy plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ fastisfy plugins unlink
  $ fastisfy plugins remove
```

## `fastisfy plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ fastisfy plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ fastisfy plugins unlink
  $ fastisfy plugins remove
```

## `fastisfy plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ fastisfy plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ fastisfy plugins unlink
  $ fastisfy plugins remove
```

## `fastisfy plugins update`

Update installed plugins.

```
USAGE
  $ fastisfy plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `fastisfy start`

Start the production server

```
USAGE
  $ fastisfy start [-h] [-p <value>]

FLAGS
  -h, --help          Show CLI help.
  -p, --port=<value>  [default: 3000] port to listen on

DESCRIPTION
  Start the production server
```
<!-- commandsstop -->
