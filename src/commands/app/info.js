/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const BaseCommand = require('../../BaseCommand')
const { flags } = require('@oclif/command')
const yaml = require('js-yaml')

class Info extends BaseCommand {
  async run () {
    // cli input
    const { flags } = this.parse(Info)
    const appConfig = this.getAppConfig()
    delete appConfig.cli
    if (!appConfig.s3.tvmUrl) {
      delete appConfig.s3.tvmUrl
    }
    // todo: mask these
    if (!appConfig.s3.creds) {
      delete appConfig.s3.creds
    }

    if (flags.mask) {
      appConfig.ow.auth = appConfig.ow.auth ? '<hidden>' : 'undefined'
    }

    if (flags.json) {
      this.log(JSON.stringify(appConfig))
    } else if (flags.yml) {
      this.log(yaml.safeDump(appConfig))
    } else { // flags.hson
      this.log(appConfig)
    }
  }
}

Info.description = `Display settings/configuration in use by an Adobe I/O App

`

Info.flags = {
  ...BaseCommand.flags,
  json: flags.boolean({
    description: 'Output json',
    char: 'j',
    exclusive: ['hson', 'yml']
  }),
  hson: flags.boolean({
    default: true,
    description: 'Output human readable json',
    char: 'h',
    exclusive: ['json', 'yml']
  }),
  yml: flags.boolean({
    description: 'Output yml',
    char: 'y',
    exclusive: ['hson', 'json']
  }),
  mask: flags.boolean({
    description: 'Hide known private info',
    default: true,
    allowNo: true
  })
}

Info.args = []

module.exports = Info
