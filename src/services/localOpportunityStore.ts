import { Opportunity } from '@/types/Opportunity';

// Global in-memory store for manual opportunities
const localOpportunities: Opportunity[] = [];

export function getLocalOpportunities(): Opportunity[] {
  return localOpportunities;
}

export function addLocalOpportunity(opp: Opportunity): void {
  localOpportunities.push(opp);
}

export function setLocalOpportunities(opps: Opportunity[]): void {
  // Clear and push
  localOpportunities.length = 0;
  localOpportunities.push(...opps);
}
