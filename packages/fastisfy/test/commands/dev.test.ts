import {expect, test} from '@oclif/test'

describe('dev', () => {
  test
  .stdout()
  .command(['dev', '--from=oclif'])
  .it('runs dev cmd', ctx => {
    expect(ctx.stdout).not.to.contain('dev friend from oclif!')
  })
})
