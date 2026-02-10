import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";

import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type DeviceProfile = {
    id : Text;
    creator : Principal;
    platform : Text;
    os : Text;
    browser : Text;
    deviceLabel : Text;
    isLoggedIn : Bool;
  };

  public type BuildEntry = {
    id : Text;
    creator : Principal;
    version : Text;
    createdAt : Int;
    targetDevice : Text;
    filename : Text;
    file : Storage.ExternalBlob;
  };

  public type UploadBuildInput = {
    version : Text;
    targetDevice : Text;
    filename : Text;
    file : Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
  };

  let deviceProfiles = Map.empty<Principal, DeviceProfile>();
  let builds = Map.empty<Text, BuildEntry>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func registerDeviceProfile(profile : DeviceProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register device profiles");
    };
    deviceProfiles.add(caller, profile);
  };

  public query ({ caller }) func getDeviceProfile(user : Principal) : async DeviceProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own device profile");
    };
    switch (deviceProfiles.get(user)) {
      case (null) { Runtime.trap("Device profile not found") };
      case (?profile) { profile };
    };
  };

  public shared ({ caller }) func uploadBuild(input : UploadBuildInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload builds");
    };
    let buildId = caller.toText() # "_" # input.filename # "_" # Time.now().toText();
    let buildEntry : BuildEntry = {
      id = buildId;
      creator = caller;
      version = input.version;
      createdAt = Time.now();
      targetDevice = input.targetDevice;
      filename = input.filename;
      file = input.file;
    };
    builds.add(buildId, buildEntry);
  };

  public query ({ caller }) func listBuilds(deviceTarget : ?Text) : async [BuildEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can list builds");
    };
    let allBuilds = List.empty<BuildEntry>();

    switch (deviceTarget) {
      case (null) {
        allBuilds.addAll(builds.values());
      };
      case (?target) {
        let filteredBuilds = builds.values().toArray().filter(
          func(build) { build.targetDevice == target }
        );
        allBuilds.addAll(filteredBuilds.values());
      };
    };

    allBuilds.toArray();
  };

  public query ({ caller }) func getBuild(buildId : Text) : async BuildEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can download builds");
    };
    switch (builds.get(buildId)) {
      case (null) { Runtime.trap("Build not found") };
      case (?build) { build };
    };
  };

  public query ({ caller }) func getBestBuildForDevice() : async BuildEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access builds");
    };
    let deviceProfile = switch (deviceProfiles.get(caller)) {
      case (null) { Runtime.trap("Device profile not found") };
      case (?profile) { profile };
    };

    let compatibleBuild = builds.values().find(
      func(build) { build.targetDevice == deviceProfile.deviceLabel }
    );

    switch (compatibleBuild) {
      case (null) { Runtime.trap("No compatible build found") };
      case (?build) { build };
    };
  };
};
