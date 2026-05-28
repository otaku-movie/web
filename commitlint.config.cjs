/**
 * Commitlint 配置：基于 Conventional Commits（cz / Angular 风格）。
 *
 * 中文/日文提交字符占用大，默认的 header-max-length: 72 / body-max-line-length: 100
 * 几乎必踩；这里改成更宽松的字符上限，同时仍要求显式 type，避免提交风格散乱。
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'perf',
        'refactor',
        'style',
        'docs',
        'test',
        'build',
        'ci',
        'chore',
        'revert'
      ]
    ],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-case': [0],
    'header-max-length': [2, 'always', 120],
    'body-max-line-length': [0],
    'footer-max-line-length': [0]
  }
}
