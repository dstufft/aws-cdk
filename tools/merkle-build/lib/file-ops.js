"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const fs = require("fs-extra");
const path = require("path");
/**
 * Return actual file contents or undefined if not exists
 */
async function atomicRead(fileName) {
    try {
        return await fs.readFile(fileName, { encoding: 'utf-8' });
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            return undefined;
        }
        throw e;
    }
}
exports.atomicRead = atomicRead;
/**
 * Atomically write a file
 */
async function atomicWrite(fileName, contents) {
    // NodeJS has no tempfile API :/
    const tempFile = path.join(path.dirname(fileName), path.basename(fileName) + '.' + crypto.randomBytes(8).toString('hex'));
    await fs.writeFile(tempFile, contents, { encoding: 'utf-8' });
    await fs.rename(tempFile, fileName);
}
exports.atomicWrite = atomicWrite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1vcHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmaWxlLW9wcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFrQztBQUNsQywrQkFBZ0M7QUFDaEMsNkJBQThCO0FBRTlCOztHQUVHO0FBQ0ksS0FBSyxVQUFVLFVBQVUsQ0FBQyxRQUFnQjtJQUMvQyxJQUFJO1FBQ0YsT0FBTyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDM0Q7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7WUFBRSxPQUFPLFNBQVMsQ0FBQztTQUFFO1FBQzlDLE1BQU0sQ0FBQyxDQUFDO0tBQ1Q7QUFDSCxDQUFDO0FBUEQsZ0NBT0M7QUFFRDs7R0FFRztBQUNJLEtBQUssVUFBVSxXQUFXLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtJQUNsRSxnQ0FBZ0M7SUFDaEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDMUgsTUFBTSxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUM5RCxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFMRCxrQ0FLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbmltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJyk7XG5pbXBvcnQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxuLyoqXG4gKiBSZXR1cm4gYWN0dWFsIGZpbGUgY29udGVudHMgb3IgdW5kZWZpbmVkIGlmIG5vdCBleGlzdHNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGF0b21pY1JlYWQoZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGF3YWl0IGZzLnJlYWRGaWxlKGZpbGVOYW1lLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGUuY29kZSA9PT0gJ0VOT0VOVCcpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIHRocm93IGU7XG4gIH1cbn1cblxuLyoqXG4gKiBBdG9taWNhbGx5IHdyaXRlIGEgZmlsZVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXRvbWljV3JpdGUoZmlsZU5hbWU6IHN0cmluZywgY29udGVudHM6IHN0cmluZykge1xuICAvLyBOb2RlSlMgaGFzIG5vIHRlbXBmaWxlIEFQSSA6L1xuICBjb25zdCB0ZW1wRmlsZSA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUoZmlsZU5hbWUpLCBwYXRoLmJhc2VuYW1lKGZpbGVOYW1lKSArICcuJyArIGNyeXB0by5yYW5kb21CeXRlcyg4KS50b1N0cmluZygnaGV4JykpO1xuICBhd2FpdCBmcy53cml0ZUZpbGUodGVtcEZpbGUsIGNvbnRlbnRzLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuICBhd2FpdCBmcy5yZW5hbWUodGVtcEZpbGUsIGZpbGVOYW1lKTtcbn1cbiJdfQ==