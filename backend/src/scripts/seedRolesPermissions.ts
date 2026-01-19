/**
 * Seed Script: Initialize Roles and Permissions
 * Run this script to populate the database with default roles and permissions
 * Usage: npx tsx backend/src/scripts/seedRolesPermissions.ts
 */

import { PrismaClient } from '@prisma/client';
import { PERMISSIONS, PERMISSION_GROUPS } from '../constants/permissions.js';

const prisma = new PrismaClient();

/**
 * All permissions with descriptions
 */
const PERMISSION_DEFINITIONS = [
  // User Management
  { code: PERMISSIONS.USER_CREATE, description: 'Create new users' },
  { code: PERMISSIONS.USER_READ_ALL, description: 'Read all user profiles' },
  { code: PERMISSIONS.USER_READ_OWN, description: 'Read own user profile' },
  { code: PERMISSIONS.USER_UPDATE_ALL, description: 'Update any user profile' },
  { code: PERMISSIONS.USER_UPDATE_OWN, description: 'Update own user profile' },
  { code: PERMISSIONS.USER_DELETE, description: 'Delete users' },
  { code: PERMISSIONS.USER_MANAGE, description: 'Full user management access' },

  // Patient Management
  { code: PERMISSIONS.PATIENT_CREATE, description: 'Create patient profiles' },
  { code: PERMISSIONS.PATIENT_READ_ALL, description: 'Read all patient data' },
  { code: PERMISSIONS.PATIENT_READ_OWN, description: 'Read own patient data' },
  { code: PERMISSIONS.PATIENT_UPDATE_ALL, description: 'Update any patient data' },
  { code: PERMISSIONS.PATIENT_UPDATE_OWN, description: 'Update own patient data' },
  { code: PERMISSIONS.PATIENT_DELETE, description: 'Delete patient profiles' },
  { code: PERMISSIONS.PATIENT_MANAGE, description: 'Full patient management access' },

  // Doctor Management
  { code: PERMISSIONS.DOCTOR_CREATE, description: 'Create doctor profiles' },
  { code: PERMISSIONS.DOCTOR_READ_ALL, description: 'Read all doctor data' },
  { code: PERMISSIONS.DOCTOR_READ_OWN, description: 'Read own doctor data' },
  { code: PERMISSIONS.DOCTOR_UPDATE_ALL, description: 'Update any doctor data' },
  { code: PERMISSIONS.DOCTOR_UPDATE_OWN, description: 'Update own doctor data' },
  { code: PERMISSIONS.DOCTOR_DELETE, description: 'Delete doctor profiles' },
  { code: PERMISSIONS.DOCTOR_MANAGE, description: 'Full doctor management access' },

  // Appointment Management
  { code: PERMISSIONS.APPOINTMENT_CREATE_ALL, description: 'Create appointments for anyone' },
  { code: PERMISSIONS.APPOINTMENT_CREATE_OWN, description: 'Create own appointments' },
  { code: PERMISSIONS.APPOINTMENT_READ_ALL, description: 'Read all appointments' },
  { code: PERMISSIONS.APPOINTMENT_READ_OWN, description: 'Read own appointments' },
  { code: PERMISSIONS.APPOINTMENT_UPDATE_ALL, description: 'Update any appointment' },
  { code: PERMISSIONS.APPOINTMENT_UPDATE_OWN, description: 'Update own appointments' },
  { code: PERMISSIONS.APPOINTMENT_DELETE_ALL, description: 'Delete any appointment' },
  { code: PERMISSIONS.APPOINTMENT_DELETE_OWN, description: 'Delete own appointments' },
  { code: PERMISSIONS.APPOINTMENT_MANAGE, description: 'Full appointment management' },

  // Consultation Management
  { code: PERMISSIONS.CONSULTATION_CREATE, description: 'Create consultations' },
  { code: PERMISSIONS.CONSULTATION_READ_ALL, description: 'Read all consultations' },
  { code: PERMISSIONS.CONSULTATION_READ_OWN, description: 'Read own consultations' },
  { code: PERMISSIONS.CONSULTATION_UPDATE_ALL, description: 'Update any consultation' },
  { code: PERMISSIONS.CONSULTATION_UPDATE_OWN, description: 'Update own consultations' },
  { code: PERMISSIONS.CONSULTATION_DELETE, description: 'Delete consultations' },
  { code: PERMISSIONS.CONSULTATION_MANAGE, description: 'Full consultation management' },

  // Vital Signs
  { code: PERMISSIONS.VITAL_CREATE_ALL, description: 'Create vitals for anyone' },
  { code: PERMISSIONS.VITAL_CREATE_OWN, description: 'Create own vitals' },
  { code: PERMISSIONS.VITAL_READ_ALL, description: 'Read all vitals' },
  { code: PERMISSIONS.VITAL_READ_OWN, description: 'Read own vitals' },
  { code: PERMISSIONS.VITAL_UPDATE_ALL, description: 'Update any vitals' },
  { code: PERMISSIONS.VITAL_UPDATE_OWN, description: 'Update own vitals' },
  { code: PERMISSIONS.VITAL_DELETE, description: 'Delete vitals' },
  { code: PERMISSIONS.VITAL_MANAGE, description: 'Full vitals management' },

  // Medication Management
  { code: PERMISSIONS.MEDICATION_CREATE, description: 'Create medication records' },
  { code: PERMISSIONS.MEDICATION_READ_ALL, description: 'Read all medications' },
  { code: PERMISSIONS.MEDICATION_READ_OWN, description: 'Read own medications' },
  { code: PERMISSIONS.MEDICATION_UPDATE_ALL, description: 'Update any medication' },
  { code: PERMISSIONS.MEDICATION_UPDATE_OWN, description: 'Update own medications' },
  { code: PERMISSIONS.MEDICATION_DELETE, description: 'Delete medications' },
  { code: PERMISSIONS.MEDICATION_MANAGE, description: 'Full medication management' },

  // Lab Results
  { code: PERMISSIONS.LAB_RESULT_CREATE, description: 'Create lab results' },
  { code: PERMISSIONS.LAB_RESULT_READ_ALL, description: 'Read all lab results' },
  { code: PERMISSIONS.LAB_RESULT_READ_OWN, description: 'Read own lab results' },
  { code: PERMISSIONS.LAB_RESULT_UPDATE, description: 'Update lab results' },
  { code: PERMISSIONS.LAB_RESULT_DELETE, description: 'Delete lab results' },
  { code: PERMISSIONS.LAB_RESULT_MANAGE, description: 'Full lab result management' },

  // Report Management
  { code: PERMISSIONS.REPORT_CREATE_ALL, description: 'Create reports for anyone' },
  { code: PERMISSIONS.REPORT_CREATE_OWN, description: 'Create own reports' },
  { code: PERMISSIONS.REPORT_READ_ALL, description: 'Read all reports' },
  { code: PERMISSIONS.REPORT_READ_OWN, description: 'Read own reports' },
  { code: PERMISSIONS.REPORT_UPDATE_ALL, description: 'Update any report' },
  { code: PERMISSIONS.REPORT_UPDATE_OWN, description: 'Update own reports' },
  { code: PERMISSIONS.REPORT_DELETE, description: 'Delete reports' },
  { code: PERMISSIONS.REPORT_MANAGE, description: 'Full report management' },

  // Message Management
  { code: PERMISSIONS.MESSAGE_CREATE, description: 'Create messages' },
  { code: PERMISSIONS.MESSAGE_READ_ALL, description: 'Read all messages' },
  { code: PERMISSIONS.MESSAGE_READ_OWN, description: 'Read own messages' },
  { code: PERMISSIONS.MESSAGE_UPDATE_OWN, description: 'Update own messages' },
  { code: PERMISSIONS.MESSAGE_DELETE_ALL, description: 'Delete any message' },
  { code: PERMISSIONS.MESSAGE_DELETE_OWN, description: 'Delete own messages' },
  { code: PERMISSIONS.MESSAGE_MANAGE, description: 'Full message management' },

  // Notification Management
  { code: PERMISSIONS.NOTIFICATION_CREATE, description: 'Create notifications' },
  { code: PERMISSIONS.NOTIFICATION_READ_ALL, description: 'Read all notifications' },
  { code: PERMISSIONS.NOTIFICATION_READ_OWN, description: 'Read own notifications' },
  { code: PERMISSIONS.NOTIFICATION_UPDATE_OWN, description: 'Update own notifications' },
  { code: PERMISSIONS.NOTIFICATION_DELETE_OWN, description: 'Delete own notifications' },
  { code: PERMISSIONS.NOTIFICATION_MANAGE, description: 'Full notification management' },

  // Role & Permission Management
  { code: PERMISSIONS.ROLE_CREATE, description: 'Create roles' },
  { code: PERMISSIONS.ROLE_READ, description: 'Read roles' },
  { code: PERMISSIONS.ROLE_UPDATE, description: 'Update roles' },
  { code: PERMISSIONS.ROLE_DELETE, description: 'Delete roles' },
  { code: PERMISSIONS.ROLE_MANAGE, description: 'Full role management' },

  { code: PERMISSIONS.PERMISSION_CREATE, description: 'Create permissions' },
  { code: PERMISSIONS.PERMISSION_READ, description: 'Read permissions' },
  { code: PERMISSIONS.PERMISSION_UPDATE, description: 'Update permissions' },
  { code: PERMISSIONS.PERMISSION_DELETE, description: 'Delete permissions' },
  { code: PERMISSIONS.PERMISSION_MANAGE, description: 'Full permission management' },

  // System Settings
  { code: PERMISSIONS.SETTINGS_READ, description: 'Read system settings' },
  { code: PERMISSIONS.SETTINGS_UPDATE, description: 'Update system settings' },
  { code: PERMISSIONS.SETTINGS_MANAGE, description: 'Full settings management' },

  // Analytics & Reports
  { code: PERMISSIONS.ANALYTICS_VIEW_ALL, description: 'View all analytics' },
  { code: PERMISSIONS.ANALYTICS_VIEW_OWN, description: 'View own analytics' },
  { code: PERMISSIONS.ANALYTICS_EXPORT, description: 'Export analytics data' },

  // Super Admin
  { code: PERMISSIONS.SUPER_ADMIN, description: 'Super admin - all permissions' },
];

/**
 * Default roles
 */
const ROLE_DEFINITIONS = [
  {
    name: 'admin',
    description: 'System Administrator - Full access to all features',
    permissions: PERMISSION_GROUPS.ADMIN,
  },
  {
    name: 'doctor',
    description: 'Medical Doctor - Access to patient care and medical records',
    permissions: PERMISSION_GROUPS.DOCTOR,
  },
  {
    name: 'patient',
    description: 'Patient - Access to own health data and appointments',
    permissions: PERMISSION_GROUPS.PATIENT,
  },
  {
    name: 'staff',
    description: 'Medical Staff - Administrative and support functions',
    permissions: PERMISSION_GROUPS.STAFF,
  },
];

async function seedRolesAndPermissions() {
  console.log('🌱 Starting to seed roles and permissions...\n');

  try {
    // 1. Create all permissions
    console.log('📝 Creating permissions...');
    
    for (const permDef of PERMISSION_DEFINITIONS) {
      await prisma.permission.upsert({
        where: { code: permDef.code },
        update: { description: permDef.description },
        create: {
          code: permDef.code,
          description: permDef.description,
        },
      });
    }

    console.log(`✅ Created/updated ${PERMISSION_DEFINITIONS.length} permissions\n`);

    // 2. Create roles and assign permissions
    console.log('👥 Creating roles and assigning permissions...');

    for (const roleDef of ROLE_DEFINITIONS) {
      // Create or update role
      const role = await prisma.role.upsert({
        where: { name: roleDef.name },
        update: { description: roleDef.description },
        create: {
          name: roleDef.name,
          description: roleDef.description,
        },
      });

      // Get permission IDs
      const permissions = await prisma.permission.findMany({
        where: {
          code: { in: [...roleDef.permissions] },
        },
      });

      // Delete existing role-permission associations
      await prisma.rolePermission.deleteMany({
        where: { roleId: role.id },
      });

      // Create new associations
      await prisma.rolePermission.createMany({
        data: permissions.map((perm) => ({
          roleId: role.id,
          permissionId: perm.id,
        })),
      });

      console.log(`  ✓ ${roleDef.name}: ${permissions.length} permissions assigned`);
    }

    console.log(`\n✅ Created/updated ${ROLE_DEFINITIONS.length} roles\n`);

    // 3. Display summary
    console.log('📊 Summary:');
    
    const totalPermissions = await prisma.permission.count();
    const totalRoles = await prisma.role.count();
    
    console.log(`  • Total Permissions: ${totalPermissions}`);
    console.log(`  • Total Roles: ${totalRoles}`);
    
    console.log('\n🎉 Seeding completed successfully!');

    // 4. Display role details
    console.log('\n📋 Role Details:');
    
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    for (const role of roles) {
      console.log(`\n  ${role.name.toUpperCase()}`);
      console.log(`  Description: ${role.description}`);
      console.log(`  Permissions (${role.permissions.length}):`);
      
      // Group permissions by resource
      const permByResource: Record<string, string[]> = {};
      
      for (const rp of role.permissions) {
        const code = rp.permission.code;
        const resource = code.split('.')[0] || 'system';
        
        if (!permByResource[resource]) {
          permByResource[resource] = [];
        }
        
        permByResource[resource].push(code);
      }

      // Display grouped permissions
      for (const [resource, perms] of Object.entries(permByResource)) {
        console.log(`    • ${resource}: ${perms.length} permissions`);
      }
    }

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedRolesAndPermissions()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
