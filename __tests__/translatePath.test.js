import {atPath, setAtPath} from "../source/translatePath";

const testObj = {
	sliceOne: "xxxx",
	sliceTwo: {
		subSliceOne: "aaaaa",
		subSliceTwo: "bbbbb"
	},
	sliceThree: {
		subSliceOne: {
			subSubSliceOne: []
		}
	}
}

test("empty path return the same obj", () => {
	expect(atPath(testObj)).toBe(testObj);
})

test("accessing first level slice", () => {
	expect(atPath(testObj, "sliceOne")).toBe(testObj.sliceOne);
})

test("accessing second level slice", () => {
	expect(atPath(testObj, "sliceTwo.subSliceOne")).toBe(testObj.sliceTwo.subSliceOne);
})

test("accessing inexistent slice throws the longuest valid subpath", () => {
	expect(() => {atPath(testObj, "sliceTwo.subSliceOne.subSubSliceOne")}).toThrowError(".sliceTwo.subSliceOne");
})

test("setAtPath return a copy, first level slice", () => {
	expect(setAtPath(testObj, "sliceThree", "hello")).toEqual(
		{
			sliceOne: "xxxx",
			sliceTwo: {
				subSliceOne: "aaaaa",
				subSliceTwo: "bbbbb"
			},
			sliceThree: "hello",
		}
	);
})

test("setAtPath return a copy, second level slice", () => {
	expect(setAtPath(testObj, "sliceThree.subSliceOne.subSubSliceOne", "hello")).toEqual(
		{
			sliceOne: "xxxx",
			sliceTwo: {
				subSliceOne: "aaaaa",
				subSliceTwo: "bbbbb"
			},
			sliceThree: {
				subSliceOne: {
					subSubSliceOne: "hello",
				}
			}
		}
	);
})

test("setAtPath return a copy, creates new slice", () => {
	expect(setAtPath(testObj, "sliceFour.subSliceFour", "hello")).toEqual(
		{
			sliceOne: "xxxx",
			sliceTwo: {
				subSliceOne: "aaaaa",
				subSliceTwo: "bbbbb"
			},
			sliceThree: {
				subSliceOne: {
					subSubSliceOne: [],
				}
			},
			sliceFour: {
				subSliceFour: "hello",
			}
		}
	);
})