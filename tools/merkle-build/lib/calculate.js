"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const fs = require("fs-extra");
const path = require("path");
const file_ops_1 = require("./file-ops");
/**
 * Calculate a hash of the given file or directory
 */
async function calculateHash(fileOrDirectory, options = {}) {
    const cache = new HashCache();
    const ignore = options.ignore || [];
    async function calculate(fileName) {
        fileName = await absolutePath(fileName);
        const stat = await fs.stat(fileName);
        if (stat.isFile()) {
            // Hash of a file is the hash of the contents.
            //
            // We don't use the cache since we never hit the same file twice.
            const hash = crypto.createHash('sha1');
            hash.update(await fs.readFile(fileName));
            return hash.digest('hex');
        }
        else {
            // Hash of a directory is the hash of an entry table.
            //
            // We do use the cache since we could encounter the same directory
            // multiple times through symlinks.
            const cachedHash = await cache.get(fileName);
            if (cachedHash !== undefined) {
                return cachedHash;
            }
            cache.markCalculating(fileName);
            const hash = crypto.createHash('sha1');
            for (const entry of await fs.readdir(fileName)) {
                if (entry.startsWith('.') && !options.includeHidden) {
                    continue;
                }
                if (ignore.indexOf(entry) !== -1) {
                    continue;
                }
                hash.update(entry);
                hash.update("|");
                hash.update(await calculate(path.join(fileName, entry)));
                hash.update("|");
            }
            const hashString = hash.digest('hex');
            await cache.store(fileName, hashString);
            return hashString;
        }
    }
    return calculate(fileOrDirectory);
}
exports.calculateHash = calculateHash;
/**
 * Return the absolute path of a file, resolving symlinks if it's a symlink
 *
 * NOTE: This does not resolve symlinks in the middle of the absolute path.
 */
async function absolutePath(fileName) {
    const stat = await fs.lstat(fileName);
    if (!stat.isSymbolicLink()) {
        return path.resolve(fileName);
    }
    const link = await fs.readlink(fileName);
    return path.resolve(path.dirname(fileName), link);
}
/**
 * This value is put into the cache if we are currently calculating a directory hash
 *
 * This is used to detect symlink cycles.
 */
const CALCULATING_MARKER = '*calculating*';
/**
 * Hash cache
 *
 * Because of monorepo symlinks, it's expected that we'll encounter the
 * same directory more than once. We store the hash of already-visited
 * directories in the cache to save time.
 *
 * At the same time, we use the cache for cycle detection.
 *
 * In principle this cache is in memory, but it can be persisted to
 * disk if an environment variable point to a directory is set.
 */
class HashCache {
    constructor() {
        this.cache = {};
        this.persistentCacheDir = process.env.MERKLE_BUILD_CACHE;
    }
    async get(fullPath) {
        if (this.cache[fullPath] === CALCULATING_MARKER) {
            throw new Error(`${fullPath}: symlink loop detected, cannot calculate directory hash`);
        }
        if (fullPath in this.cache) {
            return this.cache[fullPath];
        }
        if (this.persistentCacheDir) {
            return await file_ops_1.atomicRead(path.join(this.persistentCacheDir, safeFileName(fullPath)));
        }
        return undefined;
    }
    async store(fullPath, hash) {
        this.cache[fullPath] = hash;
        if (this.persistentCacheDir) {
            await file_ops_1.atomicWrite(path.join(this.persistentCacheDir, safeFileName(fullPath)), hash);
        }
    }
    markCalculating(fullPath) {
        this.cache[fullPath] = CALCULATING_MARKER;
    }
}
/**
 * Make a filename that's safe to store on disk
 *
 * Typically the full path name is too long so we take the end
 * and append a hash for the whole name.
 */
function safeFileName(fileName) {
    const h = crypto.createHash('sha1');
    h.update(fileName);
    const encodedName = encodeURIComponent(fileName);
    const maxLength = 150;
    return encodedName.substr(Math.max(0, encodedName.length - maxLength)) + h.digest('hex');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsY3VsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2FsY3VsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQWtDO0FBQ2xDLCtCQUFnQztBQUNoQyw2QkFBOEI7QUFDOUIseUNBQXNEO0FBRXREOztHQUVHO0FBQ0ksS0FBSyxVQUFVLGFBQWEsQ0FBQyxlQUF1QixFQUFFLFVBQXlCLEVBQUU7SUFDdEYsTUFBTSxLQUFLLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztJQUU5QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUVwQyxLQUFLLFVBQVUsU0FBUyxDQUFDLFFBQWdCO1FBQ3ZDLFFBQVEsR0FBRyxNQUFNLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV4QyxNQUFNLElBQUksR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDakIsOENBQThDO1lBQzlDLEVBQUU7WUFDRixpRUFBaUU7WUFDakUsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzQjthQUFNO1lBQ0wscURBQXFEO1lBQ3JELEVBQUU7WUFDRixrRUFBa0U7WUFDbEUsbUNBQW1DO1lBQ25DLE1BQU0sVUFBVSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3QyxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7Z0JBQUUsT0FBTyxVQUFVLENBQUM7YUFBRTtZQUNwRCxLQUFLLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FB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RUFBRTtZQUMzQixNQUFNLHNCQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDckY7SUFDSCxDQUFDO0lBRU0sZUFBZSxDQUFDLFFBQWdCO1FBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsa0JBQWtCLENBQUM7SUFDNUMsQ0FBQztDQUNGO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFTLFlBQVksQ0FBQyxRQUFnQjtJQUNwQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFbkIsTUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFakQsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDO0lBQ3RCLE9BQU8sV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuaW1wb3J0IGZzID0gcmVxdWlyZSgnZnMtZXh0cmEnKTtcbmltcG9ydCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuaW1wb3J0IHsgYXRvbWljUmVhZCwgYXRvbWljV3JpdGUgIH0gZnJvbSAnLi9maWxlLW9wcyc7XG5cbi8qKlxuICogQ2FsY3VsYXRlIGEgaGFzaCBvZiB0aGUgZ2l2ZW4gZmlsZSBvciBkaXJlY3RvcnlcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNhbGN1bGF0ZUhhc2goZmlsZU9yRGlyZWN0b3J5OiBzdHJpbmcsIG9wdGlvbnM6IE1lcmtsZU9wdGlvbnMgPSB7fSk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IGNhY2hlID0gbmV3IEhhc2hDYWNoZSgpO1xuXG4gIGNvbnN0IGlnbm9yZSA9IG9wdGlvbnMuaWdub3JlIHx8IFtdO1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGNhbGN1bGF0ZShmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBmaWxlTmFtZSA9IGF3YWl0IGFic29sdXRlUGF0aChmaWxlTmFtZSk7XG5cbiAgICBjb25zdCBzdGF0ID0gYXdhaXQgZnMuc3RhdChmaWxlTmFtZSk7XG4gICAgaWYgKHN0YXQuaXNGaWxlKCkpIHtcbiAgICAgIC8vIEhhc2ggb2YgYSBmaWxlIGlzIHRoZSBoYXNoIG9mIHRoZSBjb250ZW50cy5cbiAgICAgIC8vXG4gICAgICAvLyBXZSBkb24ndCB1c2UgdGhlIGNhY2hlIHNpbmNlIHdlIG5ldmVyIGhpdCB0aGUgc2FtZSBmaWxlIHR3aWNlLlxuICAgICAgY29uc3QgaGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJyk7XG4gICAgICBoYXNoLnVwZGF0ZShhd2FpdCBmcy5yZWFkRmlsZShmaWxlTmFtZSkpO1xuICAgICAgcmV0dXJuIGhhc2guZGlnZXN0KCdoZXgnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSGFzaCBvZiBhIGRpcmVjdG9yeSBpcyB0aGUgaGFzaCBvZiBhbiBlbnRyeSB0YWJsZS5cbiAgICAgIC8vXG4gICAgICAvLyBXZSBkbyB1c2UgdGhlIGNhY2hlIHNpbmNlIHdlIGNvdWxkIGVuY291bnRlciB0aGUgc2FtZSBkaXJlY3RvcnlcbiAgICAgIC8vIG11bHRpcGxlIHRpbWVzIHRocm91Z2ggc3ltbGlua3MuXG4gICAgICBjb25zdCBjYWNoZWRIYXNoID0gYXdhaXQgY2FjaGUuZ2V0KGZpbGVOYW1lKTtcbiAgICAgIGlmIChjYWNoZWRIYXNoICE9PSB1bmRlZmluZWQpIHsgcmV0dXJuIGNhY2hlZEhhc2g7IH1cbiAgICAgIGNhY2hlLm1hcmtDYWxjdWxhdGluZyhmaWxlTmFtZSk7XG5cbiAgICAgIGNvbnN0IGhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMScpO1xuICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBhd2FpdCBmcy5yZWFkZGlyKGZpbGVOYW1lKSkge1xuICAgICAgICBpZiAoZW50cnkuc3RhcnRzV2l0aCgnLicpICYmICFvcHRpb25zLmluY2x1ZGVIaWRkZW4pIHsgY29udGludWU7IH1cbiAgICAgICAgaWYgKGlnbm9yZS5pbmRleE9mKGVudHJ5KSAhPT0gLTEpIHsgY29udGludWU7IH1cbiAgICAgICAgaGFzaC51cGRhdGUoZW50cnkpO1xuICAgICAgICBoYXNoLnVwZGF0ZShcInxcIik7XG4gICAgICAgIGhhc2gudXBkYXRlKGF3YWl0IGNhbGN1bGF0ZShwYXRoLmpvaW4oZmlsZU5hbWUsIGVudHJ5KSkpO1xuICAgICAgICBoYXNoLnVwZGF0ZShcInxcIik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGhhc2hTdHJpbmcgPSBoYXNoLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICBhd2FpdCBjYWNoZS5zdG9yZShmaWxlTmFtZSwgaGFzaFN0cmluZyk7XG4gICAgICByZXR1cm4gaGFzaFN0cmluZztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY2FsY3VsYXRlKGZpbGVPckRpcmVjdG9yeSk7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBhYnNvbHV0ZSBwYXRoIG9mIGEgZmlsZSwgcmVzb2x2aW5nIHN5bWxpbmtzIGlmIGl0J3MgYSBzeW1saW5rXG4gKlxuICogTk9URTogVGhpcyBkb2VzIG5vdCByZXNvbHZlIHN5bWxpbmtzIGluIHRoZSBtaWRkbGUgb2YgdGhlIGFic29sdXRlIHBhdGguXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGFic29sdXRlUGF0aChmaWxlTmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3Qgc3RhdCA9IGF3YWl0IGZzLmxzdGF0KGZpbGVOYW1lKTtcbiAgaWYgKCFzdGF0LmlzU3ltYm9saWNMaW5rKCkpIHsgcmV0dXJuIHBhdGgucmVzb2x2ZShmaWxlTmFtZSk7IH1cbiAgY29uc3QgbGluayA9IGF3YWl0IGZzLnJlYWRsaW5rKGZpbGVOYW1lKTtcbiAgcmV0dXJuIHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoZmlsZU5hbWUpLCBsaW5rKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNZXJrbGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIEZpbGVzL2RpcmVjdG9yaWVzIHRvIG5vdCBpbmNsdWRlIGluIGhhc2hcbiAgICovXG4gIGlnbm9yZT86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGluY2x1ZGUgaGlkZGVuIGZpbGVzIGluIHRoZSBoYXNoXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBpbmNsdWRlSGlkZGVuPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUaGlzIHZhbHVlIGlzIHB1dCBpbnRvIHRoZSBjYWNoZSBpZiB3ZSBhcmUgY3VycmVudGx5IGNhbGN1bGF0aW5nIGEgZGlyZWN0b3J5IGhhc2hcbiAqXG4gKiBUaGlzIGlzIHVzZWQgdG8gZGV0ZWN0IHN5bWxpbmsgY3ljbGVzLlxuICovXG5jb25zdCBDQUxDVUxBVElOR19NQVJLRVIgPSAnKmNhbGN1bGF0aW5nKic7XG5cbi8qKlxuICogSGFzaCBjYWNoZVxuICpcbiAqIEJlY2F1c2Ugb2YgbW9ub3JlcG8gc3ltbGlua3MsIGl0J3MgZXhwZWN0ZWQgdGhhdCB3ZSdsbCBlbmNvdW50ZXIgdGhlXG4gKiBzYW1lIGRpcmVjdG9yeSBtb3JlIHRoYW4gb25jZS4gV2Ugc3RvcmUgdGhlIGhhc2ggb2YgYWxyZWFkeS12aXNpdGVkXG4gKiBkaXJlY3RvcmllcyBpbiB0aGUgY2FjaGUgdG8gc2F2ZSB0aW1lLlxuICpcbiAqIEF0IHRoZSBzYW1lIHRpbWUsIHdlIHVzZSB0aGUgY2FjaGUgZm9yIGN5Y2xlIGRldGVjdGlvbi5cbiAqXG4gKiBJbiBwcmluY2lwbGUgdGhpcyBjYWNoZSBpcyBpbiBtZW1vcnksIGJ1dCBpdCBjYW4gYmUgcGVyc2lzdGVkIHRvXG4gKiBkaXNrIGlmIGFuIGVudmlyb25tZW50IHZhcmlhYmxlIHBvaW50IHRvIGEgZGlyZWN0b3J5IGlzIHNldC5cbiAqL1xuY2xhc3MgSGFzaENhY2hlIHtcbiAgcHJpdmF0ZSByZWFkb25seSBjYWNoZToge1tmaWxlTmFtZTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICBwcml2YXRlIHJlYWRvbmx5IHBlcnNpc3RlbnRDYWNoZURpcj86IHN0cmluZztcblxuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wZXJzaXN0ZW50Q2FjaGVEaXIgPSBwcm9jZXNzLmVudi5NRVJLTEVfQlVJTERfQ0FDSEU7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0KGZ1bGxQYXRoOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICAgIGlmICh0aGlzLmNhY2hlW2Z1bGxQYXRoXSA9PT0gQ0FMQ1VMQVRJTkdfTUFSS0VSKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZnVsbFBhdGh9OiBzeW1saW5rIGxvb3AgZGV0ZWN0ZWQsIGNhbm5vdCBjYWxjdWxhdGUgZGlyZWN0b3J5IGhhc2hgKTtcbiAgICB9XG5cbiAgICBpZiAoZnVsbFBhdGggaW4gdGhpcy5jYWNoZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVbZnVsbFBhdGhdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBlcnNpc3RlbnRDYWNoZURpcikge1xuICAgICAgcmV0dXJuIGF3YWl0IGF0b21pY1JlYWQocGF0aC5qb2luKHRoaXMucGVyc2lzdGVudENhY2hlRGlyLCBzYWZlRmlsZU5hbWUoZnVsbFBhdGgpKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzdG9yZShmdWxsUGF0aDogc3RyaW5nLCBoYXNoOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLmNhY2hlW2Z1bGxQYXRoXSA9IGhhc2g7XG5cbiAgICBpZiAodGhpcy5wZXJzaXN0ZW50Q2FjaGVEaXIpIHtcbiAgICAgIGF3YWl0IGF0b21pY1dyaXRlKHBhdGguam9pbih0aGlzLnBlcnNpc3RlbnRDYWNoZURpciwgc2FmZUZpbGVOYW1lKGZ1bGxQYXRoKSksIGhhc2gpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBtYXJrQ2FsY3VsYXRpbmcoZnVsbFBhdGg6IHN0cmluZykge1xuICAgIHRoaXMuY2FjaGVbZnVsbFBhdGhdID0gQ0FMQ1VMQVRJTkdfTUFSS0VSO1xuICB9XG59XG5cbi8qKlxuICogTWFrZSBhIGZpbGVuYW1lIHRoYXQncyBzYWZlIHRvIHN0b3JlIG9uIGRpc2tcbiAqXG4gKiBUeXBpY2FsbHkgdGhlIGZ1bGwgcGF0aCBuYW1lIGlzIHRvbyBsb25nIHNvIHdlIHRha2UgdGhlIGVuZFxuICogYW5kIGFwcGVuZCBhIGhhc2ggZm9yIHRoZSB3aG9sZSBuYW1lLlxuICovXG5mdW5jdGlvbiBzYWZlRmlsZU5hbWUoZmlsZU5hbWU6IHN0cmluZykge1xuICBjb25zdCBoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTEnKTtcbiAgaC51cGRhdGUoZmlsZU5hbWUpO1xuXG4gIGNvbnN0IGVuY29kZWROYW1lID0gZW5jb2RlVVJJQ29tcG9uZW50KGZpbGVOYW1lKTtcblxuICBjb25zdCBtYXhMZW5ndGggPSAxNTA7XG4gIHJldHVybiBlbmNvZGVkTmFtZS5zdWJzdHIoTWF0aC5tYXgoMCwgZW5jb2RlZE5hbWUubGVuZ3RoIC0gbWF4TGVuZ3RoKSkgKyBoLmRpZ2VzdCgnaGV4Jyk7XG59XG4iXX0=