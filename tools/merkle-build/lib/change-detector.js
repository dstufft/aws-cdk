"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const calculate_1 = require("./calculate");
const file_ops_1 = require("./file-ops");
/**
 * Calculate the folder hash and see if it changed since the last build
 */
class ChangeDetector {
    constructor(directory, options = {}) {
        this.directory = directory;
        this.options = options;
        this.markerFileName = path.join(directory, options.markerFile || '.LAST_BUILD');
    }
    /**
     * Return whether the folder hash changed since last time
     */
    async isChanged() {
        const marker = await file_ops_1.atomicRead(this.markerFileName);
        if (marker === undefined) {
            return true;
        }
        const actual = await calculate_1.calculateHash(this.directory, this.options);
        return marker !== actual;
    }
    async markClean() {
        const hash = await calculate_1.calculateHash(this.directory, this.options);
        await file_ops_1.atomicWrite(this.markerFileName, hash);
    }
}
exports.ChangeDetector = ChangeDetector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlLWRldGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2hhbmdlLWRldGVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQThCO0FBQzlCLDJDQUEyRDtBQUMzRCx5Q0FBcUQ7QUFFckQ7O0dBRUc7QUFDSCxNQUFhLGNBQWM7SUFHekIsWUFBb0IsU0FBaUIsRUFBVSxVQUFpQyxFQUFFO1FBQTlELGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUE0QjtRQUNoRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxVQUFVLElBQUksYUFBYSxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUVEOztPQUVHO0lBQ0ksS0FBSyxDQUFDLFNBQVM7UUFDcEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxxQkFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNyRCxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFBRSxPQUFPLElBQUksQ0FBQztTQUFFO1FBQzFDLE1BQU0sTUFBTSxHQUFHLE1BQU0seUJBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRSxPQUFPLE1BQU0sS0FBSyxNQUFNLENBQUM7SUFDM0IsQ0FBQztJQUVNLEtBQUssQ0FBQyxTQUFTO1FBQ3BCLE1BQU0sSUFBSSxHQUFHLE1BQU0seUJBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvRCxNQUFNLHNCQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0Y7QUFyQkQsd0NBcUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5pbXBvcnQgeyBjYWxjdWxhdGVIYXNoLCBNZXJrbGVPcHRpb25zIH0gZnJvbSBcIi4vY2FsY3VsYXRlXCI7XG5pbXBvcnQgeyBhdG9taWNSZWFkLCBhdG9taWNXcml0ZSB9IGZyb20gJy4vZmlsZS1vcHMnO1xuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgZm9sZGVyIGhhc2ggYW5kIHNlZSBpZiBpdCBjaGFuZ2VkIHNpbmNlIHRoZSBsYXN0IGJ1aWxkXG4gKi9cbmV4cG9ydCBjbGFzcyBDaGFuZ2VEZXRlY3RvciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbWFya2VyRmlsZU5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRpcmVjdG9yeTogc3RyaW5nLCBwcml2YXRlIG9wdGlvbnM6IENoYW5nZURldGVjdG9yT3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5tYXJrZXJGaWxlTmFtZSA9IHBhdGguam9pbihkaXJlY3RvcnksIG9wdGlvbnMubWFya2VyRmlsZSB8fCAnLkxBU1RfQlVJTEQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gd2hldGhlciB0aGUgZm9sZGVyIGhhc2ggY2hhbmdlZCBzaW5jZSBsYXN0IHRpbWVcbiAgICovXG4gIHB1YmxpYyBhc3luYyBpc0NoYW5nZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgbWFya2VyID0gYXdhaXQgYXRvbWljUmVhZCh0aGlzLm1hcmtlckZpbGVOYW1lKTtcbiAgICBpZiAobWFya2VyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHRydWU7IH1cbiAgICBjb25zdCBhY3R1YWwgPSBhd2FpdCBjYWxjdWxhdGVIYXNoKHRoaXMuZGlyZWN0b3J5LCB0aGlzLm9wdGlvbnMpO1xuICAgIHJldHVybiBtYXJrZXIgIT09IGFjdHVhbDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBtYXJrQ2xlYW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgaGFzaCA9IGF3YWl0IGNhbGN1bGF0ZUhhc2godGhpcy5kaXJlY3RvcnksIHRoaXMub3B0aW9ucyk7XG4gICAgYXdhaXQgYXRvbWljV3JpdGUodGhpcy5tYXJrZXJGaWxlTmFtZSwgaGFzaCk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBDaGFuZ2VEZXRlY3Rvck9wdGlvbnMgZXh0ZW5kcyBNZXJrbGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoYXQgZmlsZSBuYW1lIHRvIHVzZSB0byBzdG9yZSBoYXNoIGRhdGEgaW5cbiAgICpcbiAgICogQGRlZmF1bHQgLkxBU1RfQlVJTERcbiAgICovXG4gIG1hcmtlckZpbGU/OiBzdHJpbmc7XG59XG4iXX0=