import { pgTable, serial, varchar, timestamp, numeric, text, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firebaseUid: varchar('firebase_uid', { length: 128 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'income' or 'expense'
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  description: text('description'),
  date: timestamp('date').notNull(),
  isRecurring: boolean('is_recurring').default(false),
  recurringPeriod: varchar('recurring_period', { length: 20 }), // 'weekly', 'monthly', 'yearly'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const contracts = pgTable('contracts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  contractNumber: varchar('contract_number', { length: 100 }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  frequency: varchar('frequency', { length: 20 }), // 'monthly', 'yearly', etc.
  status: varchar('status', { length: 20 }).notNull(), // 'active', 'expired', 'cancelled'
  documentUrl: text('document_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const savingsGoals = pgTable('savings_goals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  targetAmount: numeric('target_amount', { precision: 10, scale: 2 }).notNull(),
  currentAmount: numeric('current_amount', { precision: 10, scale: 2 }).default('0'),
  deadline: timestamp('deadline'),
  status: varchar('status', { length: 20 }).notNull(), // 'active', 'completed', 'cancelled'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull()
});