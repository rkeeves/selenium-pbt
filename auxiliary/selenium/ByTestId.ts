import { By } from "selenium-webdriver";

export const byTestId = (testId: string) => By.css(`*[data-test='${testId}']`);
