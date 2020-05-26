import chalk from 'chalk';
import { PersonTypeEnum } from '../utils';

/*

Intro:

    Filtering requirements have grown. We need to be
    able to filter any kind of Persons.

Exercise:

    Fix typing for the filterPersons so that it can filter users
    and return User[] when personType=PersonTypeEnum.user and return Admin[]
    when personType=PersonTypeEnum.admin. Also filterPersons should accept
    partial User/Admin type according to the personType.

Higher difficulty bonus exercise:

    Implement a function `getObjectKeys()` which returns proper type
    for any argument given, so that you don't need to cast it.

    let criteriaKeys = Object.keys(criteria) as (keyof User)[];
    -->
    let criteriaKeys = getObjectKeys(criteria);

Run:

    npm run 5

    - OR -

    yarn -s 5

*/

interface User {
  type: PersonTypeEnum.user;
  name: string;
  age: number;
  occupation: string;
}

interface Admin {
  type: PersonTypeEnum.admin;
  name: string;
  age: number;
  role: string;
}

type Person = User | Admin;

const persons: Person[] = [
  {
    type: PersonTypeEnum.user,
    name: 'Max Mustermann',
    age: 25,
    occupation: 'Chimney sweep',
  },
  {
    type: PersonTypeEnum.admin,
    name: 'Jane Doe',
    age: 32,
    role: 'Administrator',
  },
  {
    type: PersonTypeEnum.user,
    name: 'Kate Müller',
    age: 23,
    occupation: 'Astronaut',
  },
  {
    type: PersonTypeEnum.admin,
    name: 'Bruce Willis',
    age: 64,
    role: 'World saver',
  },
  { type: PersonTypeEnum.user, name: 'Wilson', age: 23, occupation: 'Ball' },
  {
    type: PersonTypeEnum.admin,
    name: 'Agent Smith',
    age: 23,
    role: 'Anti-virus engineer',
  },
];

function logPerson(person: Person) {
  console.log(
    ` - ${chalk.green(person.name)}, ${person.age}, ${
      person.type === PersonTypeEnum.admin ? person.role : person.occupation
    }`
  );
}

function getObjectKeys<O>(obj: O): (keyof O)[] {
  return Object.keys(obj) as (keyof O)[];
}

type FilterCriteria<T> = Partial<Omit<T, 'type'>>;

function filterPersons(
  persons: Person[],
  personType: PersonTypeEnum.user,
  criteria: FilterCriteria<Admin>
): User[];
function filterPersons(
  persons: Person[],
  personType: PersonTypeEnum.admin,
  criteria: FilterCriteria<User>
): Admin[];
function filterPersons(
  persons: Person[],
  personType: PersonTypeEnum.user | PersonTypeEnum.admin,
  criteria: FilterCriteria<Person>
): Person[] {
  return persons
    .filter((person) => person.type === personType)
    .filter((person) => {
      let criteriaKeys = getObjectKeys(criteria);
      return criteriaKeys.every((fieldName) => {
        return person[fieldName] === criteria[fieldName];
      });
    });
}

let usersOfAge23: User[] = filterPersons(persons, PersonTypeEnum.user, {
  age: 23,
});
let adminsOfAge23: Admin[] = filterPersons(persons, PersonTypeEnum.admin, {
  age: 23,
});

console.log(chalk.yellow('Users of age 23:'));
usersOfAge23.forEach(logPerson);

console.log();

console.log(chalk.yellow('Admins of age 23:'));
adminsOfAge23.forEach(logPerson);

// In case if you are stuck:
// https://www.typescriptlang.org/docs/handbook/functions.html#overloads
