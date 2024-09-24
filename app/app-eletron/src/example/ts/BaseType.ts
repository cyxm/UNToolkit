//base type
//boolean
let isDone: boolean = false;
//number
let decNumber: number = 6;
let hexNumber: number = 0xf00d;
let binNumber: number = 0b1010;
let octNumber: number = 0o777;
//string
let stringVar: string = "TS";
let stringTemplate: string = `Hello ${stringVar}`;
//array
let arr: number[] = [1, 2, 3];
let arr2: Array<string> = ["apple", "banana", "cherry"];
//tuple
let tuple: [string, number] = ["hello", 10];
//any
let notSure: any = 4;
notSure = "maybe a string instead";
//type transform
let anyVar: any = "hello";
let shouldBeString: string = anyVar as string;
shouldBeString = <string>anyVar

//variable declaration
let var1: string = "hello";
var var2: number = 10;
const var3: boolean = true;

//flat structure
let flatArray = [1, 2, 3, 4, 5];
let [first, second, third, fourth, fifth] = flatArray;
let [array0, ...rest] = flatArray;
let obj = {
    a: "string",
    b: 10,
    c: true
};
let { a, ...restObj } = obj;
let expandArray = [1, 2, 3];
let expandArray2 = [...expandArray, 4, 5];
let expandObj = {
    a: "string",
    b: 10,
    c: true
};
let expandObj2 = {
    ...expandObj,
    d: false
}