import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { ScenarioWorld } from "../setup/world";

When(/^I am on When$/, async () => {
  console.log("in when");
});

Then(/^I am in Then$/, async () => {
  console.log("in then");
});
