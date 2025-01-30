/**
 * @description Compares 2 semantic versions.
 * @cases
 * @> 0 - versionA is newer than versionB
 * @< 0 - versionA is older than versionB
 * @= 0 - versionA and versionB are the same
 * @param {T extends string} versionA
 * @param {T extends string} versionB
 * @return {number}
 */

function compareSemanticVersions(versionA: string, versionB: string): number {
	const [majorA, minorA, patchA] = versionA.split('.').map(Number);
	const [majorB, minorB, patchB] = versionB.split('.').map(Number);

	if (majorA !== majorB) {
		return majorA - majorB;
	}

	if (minorA !== minorB) {
		return minorA - minorB;
	}

	return patchA - patchB;
}

/**
 * @description Retrieves the highest version from updates.json.
 * @param {Array<{ version: string }>} versionsList - List of objects containing version information.
 * @return {string | null} - The highest version found, or null if the list is empty.
 */
function getHighestVersion(versionsList: { version: string }[]): string | null {
	if (versionsList.length === 0) return null;

	return versionsList.reduce((highest, current) =>
		compareSemanticVersions(highest.version, current.version) > 0 ? highest : current
	).version;
}

export { compareSemanticVersions, getHighestVersion };