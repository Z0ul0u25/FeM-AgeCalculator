"use strict";

let inputs = [];
let outputs = [];
let plural = [];

let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

let objErrorMsg = {
	"required": "This field is required",
	"NaN": "Not a number",
	"not_past": "Must be in the past",
	"invalid": "Must be a valid ",
	"not_leap": "Not a leap year"
};

const MAX_DAY = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Validation of year input
 * @returns if year is valid
 */
function validateYear() {
	inputs.year.nextElementSibling.innerHTML = "";
	if (inputs.year.value == "") {
		inputs.year.nextElementSibling.innerHTML = objErrorMsg.required;
		return false;
	}

	if(isNaN(inputs.year.value)){
		inputs.year.nextElementSibling.innerHTML = objErrorMsg.NaN;
		return false;
	}

	if (inputs.year.value > currentDate.getFullYear()) {
		inputs.year.nextElementSibling.innerHTML = objErrorMsg.not_past;
		return false;
	}

	return true;
}

/**
 * Validation of month input
 * @returns if month is valid
 */
function validateMonth() {
	inputs.month.nextElementSibling.innerHTML = "";
	if (inputs.month.value == "") {
		inputs.month.nextElementSibling.innerHTML = objErrorMsg.required;
		return false;
	}

	if(isNaN(inputs.month.value)){
		inputs.month.nextElementSibling.innerHTML = objErrorMsg.NaN;
		return false;
	}

	if (inputs.year.value == currentDate.getFullYear() && inputs.month.value > currentDate.getMonth() + 1) {
		inputs.month.nextElementSibling.innerHTML = objErrorMsg.not_past;
		return false;
	}

	if (inputs.month.value > 12 || inputs.month.value < 1) {
		inputs.month.nextElementSibling.innerHTML = objErrorMsg.invalid + "month";
		return false;
	}

	return true;
}

/**
 * Validation of day input
 * @returns if day is valid
 */
function validateDay() {
	inputs.day.nextElementSibling.innerHTML = "";
	if (inputs.day.value == "") {
		inputs.day.nextElementSibling.innerHTML = objErrorMsg.required;
		return false;
	}

	if(isNaN(inputs.day.value)){
		inputs.day.nextElementSibling.innerHTML = objErrorMsg.NaN;
		return false;
	}

	// Enjoy this leap year code
	if (inputs.month.value == 2 &&
		inputs.day.value == 29 &&
		!(inputs.year.value % 400 == 0 ||
			(inputs.year.value % 4 == 0 && inputs.year.value % 100 != 0))) {
		inputs.day.nextElementSibling.innerHTML = objErrorMsg.not_leap;
		return false;
	}

	if (inputs.day.value > MAX_DAY[inputs.month.value - 1] ||
		inputs.day.value > 31 || // if month input invalid, need this check
		inputs.day.value < 1) {
		inputs.day.nextElementSibling.innerHTML = objErrorMsg.invalid + "day";
		return false;
	}

	if (inputs.year.value == currentDate.getFullYear() && inputs.month.value == currentDate.getMonth() + 1 && inputs.day.value > currentDate.getDate()) {
		inputs.day.nextElementSibling.innerHTML = objErrorMsg.not_past;
		return false;
	}

	return true;
}
/**
 * Calculate the time elapse
 * @param {Event} e event from form
 */
function calculateAge(e) {
	let validation = [];
	// sanitation
	inputs.day.value = Math.floor(inputs.day.value.trim());
	inputs.month.value = Math.floor(inputs.month.value.trim());
	inputs.year.value = Math.floor(inputs.year.value.trim());
	// validation

	validation.push(validateYear());
	validation.push(validateMonth());
	validation.push(validateDay());

	for (const elem in outputs) {
		outputs[elem].innerHTML = "--";
	}

	if (validation[0] && validation[1] && validation[2]) {

		let birthDate = new Date(inputs.year.value, inputs.month.value - 1, inputs.day.value);
		birthDate.setFullYear(inputs.year.value); // if year is between 00-99 not remap to 1900-1999
		let age = [];

		age.day = (31 + (currentDate.getDate() - birthDate.getDate())) % 31;

		age.month = (12 + (currentDate.getMonth() - birthDate.getMonth())) % 12;

		age.year = currentDate.getFullYear() - birthDate.getFullYear();

		if (currentDate.getMonth() == birthDate.getMonth() && currentDate.getDate() < birthDate.getDate() ||
			currentDate.getMonth() < birthDate.getMonth()) {
			age.year--;
		}

		if (currentDate.getDate() < birthDate.getDate()) {
			if(--age.month == -1){
				age.month = 11;
			}
		}

		outputs.year.innerHTML = age.year;
		outputs.month.innerHTML = age.month;
		outputs.day.innerHTML = age.day;

		plural.day.classList = (age.day < 2) ? "hidden" : "";
		plural.month.classList = (age.month < 2) ? "hidden" : "";
		plural.year.classList = (age.year < 2) ? "hidden" : "";

	}

	e.preventDefault();
}

/**
 * Initialising after page loaded
 */
function init() {
	inputs.day = document.getElementById('input__day');
	inputs.month = document.getElementById('input__month');
	inputs.year = document.getElementById('input__year');

	outputs.day = document.getElementById('result__day').firstElementChild;
	outputs.month = document.getElementById('result__month').firstElementChild;
	outputs.year = document.getElementById('result__year').firstElementChild;

	plural.day = document.getElementById('day__plural');
	plural.month = document.getElementById('month__plural');
	plural.year = document.getElementById('year__plural');

	document.getElementById("form").addEventListener("submit", calculateAge, false);
}

window.addEventListener("load", init, false);