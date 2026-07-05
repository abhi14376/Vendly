import { TenderMatch } from '@/types/Tender';

let matchedVendors: TenderMatch[] = [];

export const getLeadMatchedVendors = (): TenderMatch[] => {
  return [...matchedVendors];
};

export const addLeadMatchedVendor = (match: TenderMatch) => {
  matchedVendors = [match, ...matchedVendors];
};
