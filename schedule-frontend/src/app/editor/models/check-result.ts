export interface RestrictionCheckResult {
	restriction: string;
    checkPassed: boolean;
    message: string;
}

export interface CheckResult {
	key: RestrictionCheckResult;
	value: string;
}
