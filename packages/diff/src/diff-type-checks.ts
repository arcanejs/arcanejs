/* eslint-disable */
import { diffJson, Diff } from './diff';

/**
 * This file is designed to ensure that the Diff type correctly infers
 * deeply nested values.
 */

type ComplexTypeA = {
  foo: string;
  baz?: ComplexTypeB;
};

type ComplexTypeB = {
  bat: number;
  bar?: ComplexTypeA;
};

type ComplexDiff = Diff<ComplexTypeA>;

const a: ComplexDiff = diffJson({ foo: 'bar' }, { foo: 'baz' });

const _types: 'match' | 'modified' = a.type;

if (a.type === 'modified') {
  const _addFoo: string | undefined = a.additions?.foo;
  const _delFoo: string | undefined = a.deletions?.foo;

  const _fooTypes: 'value' | undefined = a.changes?.foo?.type;

  if (a.changes?.foo?.type === 'value') {
    const _beforeFoo: string = a.changes.foo.before;
    const _afterFoo: string = a.changes.foo.before;
  }

  const _addBaz: ComplexTypeB | undefined = a.additions?.baz;
  const _delBaz: ComplexTypeB | undefined = a.deletions?.baz;

  const _bazTypes: 'modified' | undefined = a.changes?.baz?.type;

  if (a.changes?.baz?.type === 'modified') {
    const _addBat: number | undefined = a.changes.baz.additions?.bat;
    const _delBat: number | undefined = a.changes.baz.deletions?.bat;

    const _batTypes: 'value' | undefined = a.changes.baz.changes?.bat?.type;

    if (a.changes.baz.changes?.bat?.type === 'value') {
      const _beforeBat: number = a.changes.baz.changes.bat.before;
      const _afterBat: number = a.changes.baz.changes.bat.before;
    }

    const _addBar: ComplexTypeA | undefined = a.changes.baz.additions?.bar;
    const _delBar: ComplexTypeA | undefined = a.changes.baz.deletions?.bar;

    const _barTypes: 'modified' | undefined = a.changes.baz.changes?.bar?.type;

    if (a.changes.baz.changes?.bar?.type === 'modified') {
      const _addFoo: string | undefined =
        a.changes.baz.changes.bar.additions?.foo;
      const _delFoo: string | undefined =
        a.changes.baz.changes.bar.deletions?.foo;

      if (a.changes.baz.changes.bar.changes?.foo?.type === 'value') {
        const _beforeFoo: string = a.changes.baz.changes.bar.changes.foo.before;
        const _afterFoo: string = a.changes.baz.changes.bar.changes.foo.before;
      }
    }
  }
}
