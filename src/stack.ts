import * as core from '@actions/core';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import {Stack} from './types';

export function getStack(name: string): Stack {
  const stackName = core.getInput('stackName');

  const data = fs.readFileSync(`nanoapi_stacks/${stackName}.yml`);
  const stack: Stack = yaml.load(data);

  return stack;
}
