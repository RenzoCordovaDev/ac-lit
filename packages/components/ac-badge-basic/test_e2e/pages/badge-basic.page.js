import { ComponentObject } from '@ac-base/ac-e2e-testing';

export const BADGE_SELECTORS = {
  neutral: '[data-testid="badge-neutral"]',
  success: '[data-testid="badge-success"]',
  warning: '[data-testid="badge-warning"]',
  danger: '[data-testid="badge-danger"]',
};

export class BadgeBasicPage extends ComponentObject {
  constructor(variant) {
    super({ selector: BADGE_SELECTORS[variant] });
  }
}
