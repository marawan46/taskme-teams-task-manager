import {
     AbilityBuilder,
     createMongoAbility,
     MongoAbility,
} from "@casl/ability";

// Standardized CASL actions mapping to database operations
export type Action =
     | "read"
     | "add"
     | "update"
     | "delete"
     | "manage"
     | "invite"
     | "remove"
     | "approve";

// Universal subjects supporting projects, tasks, milestones, members, workspaces, billing
export type Subject =
     | "Project"
     | "Tasks"
     | "Milestones"
     | "Member"
     | "all";

export type AppAbility = MongoAbility<[Action, Subject]>;

export function createAbilityForUser(permissions: string[]) {
     const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

     permissions.forEach((perm) => {
          // DB permissions format: 'update:project', 'add:tasks', 'invite:members', etc.
          const [actionRaw, subjectRaw] = perm.split(":");
          let subject: Subject = "all";
          if (subjectRaw) {
               const normalized = subjectRaw.toLowerCase();
               if (normalized === "members") subject = "Member";
               else
                    subject = (normalized.charAt(0).toUpperCase() +
                         normalized.slice(1)) as Subject;
          }
          can(actionRaw as Action, subject);
     });

     return build();
}
