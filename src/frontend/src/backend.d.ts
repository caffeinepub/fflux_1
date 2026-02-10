import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface BuildEntry {
    id: string;
    creator: Principal;
    targetDevice: string;
    file: ExternalBlob;
    createdAt: bigint;
    filename: string;
    version: string;
}
export interface DeviceProfile {
    id: string;
    os: string;
    creator: Principal;
    deviceLabel: string;
    isLoggedIn: boolean;
    platform: string;
    browser: string;
}
export interface UploadBuildInput {
    targetDevice: string;
    file: ExternalBlob;
    filename: string;
    version: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getBestBuildForDevice(): Promise<BuildEntry>;
    getBuild(buildId: string): Promise<BuildEntry>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDeviceProfile(user: Principal): Promise<DeviceProfile>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listBuilds(deviceTarget: string | null): Promise<Array<BuildEntry>>;
    registerDeviceProfile(profile: DeviceProfile): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    uploadBuild(input: UploadBuildInput): Promise<void>;
}
