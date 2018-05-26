import { Container, inject } from 'inversify';
import {
  autoProvide,
  makeFluentProvideDecorator,
  makeProvideDecorator
} from 'inversify-binding-decorators';
const container = new Container();

const provide = makeProvideDecorator(container);
const fluentProvider = makeFluentProvideDecorator(container);

const provideNamed = (identifier: any, name: any) => {
  return fluentProvider(identifier)
    .whenTargetNamed(name)
    .done();
};

export { container, autoProvide, provide, provideNamed, inject };
