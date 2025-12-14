import { z } from 'zod';
import type { Prisma } from '../../../generated/prisma';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','address','phoneNumber','createdAt','updatedAt','locationId']);

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','accountId','providerId','accessToken','refreshToken','idToken','expiresAt','password']);

export const SessionScalarFieldEnumSchema = z.enum(['id','userId','expiresAt','ipAddress','userAgent']);

export const VerificationScalarFieldEnumSchema = z.enum(['id','identifier','value','expiresAt']);

export const RoleScalarFieldEnumSchema = z.enum(['id','name']);

export const UserRoleScalarFieldEnumSchema = z.enum(['id','roleId','userId']);

export const CategoryScalarFieldEnumSchema = z.enum(['id','name','description','createdAt']);

export const MenuScalarFieldEnumSchema = z.enum(['id','name','description','categoryId']);

export const MenuSizeScalarFieldEnumSchema = z.enum(['id','name','price','isAvailable','menuId']);

export const MenuAddonScalarFieldEnumSchema = z.enum(['id','name','price','isAvailable','menuId']);

export const OrderScalarFieldEnumSchema = z.enum(['id','total','customerName','paymentStatus','orderStatus','specialInstruction']);

export const OrderItemScalarFieldEnumSchema = z.enum(['id','menuSizeId','quantity','total','orderId']);

export const OrderItemAddonScalarFieldEnumSchema = z.enum(['id','menuAddonId','orderItemId','quantity','total']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullish(),
  address: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  locationId: z.string().nullish(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER PARTIAL SCHEMA
/////////////////////////////////////////

export const UserPartialSchema = UserSchema.partial()

export type UserPartial = z.infer<typeof UserPartialSchema>

// USER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const UserOptionalDefaultsSchema = UserSchema.merge(z.object({
  id: z.uuid().optional(),
  emailVerified: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().nullish(),
  refreshToken: z.string().nullish(),
  idToken: z.string().nullish(),
  expiresAt: z.coerce.date().nullish(),
  password: z.string().nullish(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// ACCOUNT PARTIAL SCHEMA
/////////////////////////////////////////

export const AccountPartialSchema = AccountSchema.partial()

export type AccountPartial = z.infer<typeof AccountPartialSchema>

// ACCOUNT OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const AccountOptionalDefaultsSchema = AccountSchema.merge(z.object({
  id: z.uuid().optional(),
}))

export type AccountOptionalDefaults = z.infer<typeof AccountOptionalDefaultsSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  expiresAt: z.coerce.date(),
  ipAddress: z.string().nullish(),
  userAgent: z.string().nullish(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// SESSION PARTIAL SCHEMA
/////////////////////////////////////////

export const SessionPartialSchema = SessionSchema.partial()

export type SessionPartial = z.infer<typeof SessionPartialSchema>

// SESSION OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const SessionOptionalDefaultsSchema = SessionSchema.merge(z.object({
  id: z.uuid().optional(),
}))

export type SessionOptionalDefaults = z.infer<typeof SessionOptionalDefaultsSchema>

/////////////////////////////////////////
// VERIFICATION SCHEMA
/////////////////////////////////////////

export const VerificationSchema = z.object({
  id: z.uuid(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.coerce.date(),
})

export type Verification = z.infer<typeof VerificationSchema>

/////////////////////////////////////////
// VERIFICATION PARTIAL SCHEMA
/////////////////////////////////////////

export const VerificationPartialSchema = VerificationSchema.partial()

export type VerificationPartial = z.infer<typeof VerificationPartialSchema>

// VERIFICATION OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const VerificationOptionalDefaultsSchema = VerificationSchema.merge(z.object({
  id: z.uuid().optional(),
}))

export type VerificationOptionalDefaults = z.infer<typeof VerificationOptionalDefaultsSchema>

/////////////////////////////////////////
// ROLE SCHEMA
/////////////////////////////////////////

export const RoleSchema = z.object({
  id: z.uuid(),
  name: z.string(),
})

export type Role = z.infer<typeof RoleSchema>

/////////////////////////////////////////
// ROLE PARTIAL SCHEMA
/////////////////////////////////////////

export const RolePartialSchema = RoleSchema.partial()

export type RolePartial = z.infer<typeof RolePartialSchema>

// ROLE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const RoleOptionalDefaultsSchema = RoleSchema.merge(z.object({
  id: z.uuid().optional(),
}))

export type RoleOptionalDefaults = z.infer<typeof RoleOptionalDefaultsSchema>

/////////////////////////////////////////
// USER ROLE SCHEMA
/////////////////////////////////////////

export const UserRoleSchema = z.object({
  id: z.uuid(),
  roleId: z.string(),
  userId: z.string(),
})

export type UserRole = z.infer<typeof UserRoleSchema>

/////////////////////////////////////////
// USER ROLE PARTIAL SCHEMA
/////////////////////////////////////////

export const UserRolePartialSchema = UserRoleSchema.partial()

export type UserRolePartial = z.infer<typeof UserRolePartialSchema>

// USER ROLE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const UserRoleOptionalDefaultsSchema = UserRoleSchema.merge(z.object({
  id: z.uuid().optional(),
}))

export type UserRoleOptionalDefaults = z.infer<typeof UserRoleOptionalDefaultsSchema>

/////////////////////////////////////////
// CATEGORY SCHEMA
/////////////////////////////////////////

export const CategorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullish(),
  createdAt: z.coerce.date(),
})

export type Category = z.infer<typeof CategorySchema>

/////////////////////////////////////////
// CATEGORY PARTIAL SCHEMA
/////////////////////////////////////////

export const CategoryPartialSchema = CategorySchema.partial()

export type CategoryPartial = z.infer<typeof CategoryPartialSchema>

// CATEGORY OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const CategoryOptionalDefaultsSchema = CategorySchema.merge(z.object({
  id: z.uuid().optional(),
  createdAt: z.coerce.date().optional(),
}))

export type CategoryOptionalDefaults = z.infer<typeof CategoryOptionalDefaultsSchema>

/////////////////////////////////////////
// MENU SCHEMA
/////////////////////////////////////////

export const MenuSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  categoryId: z.string(),
})

export type Menu = z.infer<typeof MenuSchema>

/////////////////////////////////////////
// MENU PARTIAL SCHEMA
/////////////////////////////////////////

export const MenuPartialSchema = MenuSchema.partial()

export type MenuPartial = z.infer<typeof MenuPartialSchema>

// MENU OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const MenuOptionalDefaultsSchema = MenuSchema.merge(z.object({
  id: z.uuid().optional(),
}))

export type MenuOptionalDefaults = z.infer<typeof MenuOptionalDefaultsSchema>

/////////////////////////////////////////
// MENU SIZE SCHEMA
/////////////////////////////////////////

export const MenuSizeSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  price: z.number().int(),
  isAvailable: z.boolean(),
  menuId: z.string(),
})

export type MenuSize = z.infer<typeof MenuSizeSchema>

/////////////////////////////////////////
// MENU SIZE PARTIAL SCHEMA
/////////////////////////////////////////

export const MenuSizePartialSchema = MenuSizeSchema.partial()

export type MenuSizePartial = z.infer<typeof MenuSizePartialSchema>

// MENU SIZE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const MenuSizeOptionalDefaultsSchema = MenuSizeSchema.merge(z.object({
  id: z.uuid().optional(),
}))

export type MenuSizeOptionalDefaults = z.infer<typeof MenuSizeOptionalDefaultsSchema>

/////////////////////////////////////////
// MENU ADDON SCHEMA
/////////////////////////////////////////

export const MenuAddonSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  price: z.number().int(),
  isAvailable: z.boolean(),
  menuId: z.string(),
})

export type MenuAddon = z.infer<typeof MenuAddonSchema>

/////////////////////////////////////////
// MENU ADDON PARTIAL SCHEMA
/////////////////////////////////////////

export const MenuAddonPartialSchema = MenuAddonSchema.partial()

export type MenuAddonPartial = z.infer<typeof MenuAddonPartialSchema>

// MENU ADDON OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const MenuAddonOptionalDefaultsSchema = MenuAddonSchema.merge(z.object({
  id: z.uuid().optional(),
}))

export type MenuAddonOptionalDefaults = z.infer<typeof MenuAddonOptionalDefaultsSchema>

/////////////////////////////////////////
// ORDER SCHEMA
/////////////////////////////////////////

export const OrderSchema = z.object({
  id: z.uuid(),
  total: z.number().int(),
  customerName: z.string(),
  paymentStatus: z.string(),
  orderStatus: z.string(),
  specialInstruction: z.string(),
})

export type Order = z.infer<typeof OrderSchema>

/////////////////////////////////////////
// ORDER PARTIAL SCHEMA
/////////////////////////////////////////

export const OrderPartialSchema = OrderSchema.partial()

export type OrderPartial = z.infer<typeof OrderPartialSchema>

// ORDER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const OrderOptionalDefaultsSchema = OrderSchema.merge(z.object({
  id: z.uuid().optional(),
}))

export type OrderOptionalDefaults = z.infer<typeof OrderOptionalDefaultsSchema>

/////////////////////////////////////////
// ORDER ITEM SCHEMA
/////////////////////////////////////////

export const OrderItemSchema = z.object({
  id: z.string(),
  menuSizeId: z.string(),
  quantity: z.number().int(),
  total: z.number().int(),
  orderId: z.string(),
})

export type OrderItem = z.infer<typeof OrderItemSchema>

/////////////////////////////////////////
// ORDER ITEM PARTIAL SCHEMA
/////////////////////////////////////////

export const OrderItemPartialSchema = OrderItemSchema.partial()

export type OrderItemPartial = z.infer<typeof OrderItemPartialSchema>

// ORDER ITEM OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const OrderItemOptionalDefaultsSchema = OrderItemSchema.merge(z.object({
  id: z.string().optional(),
}))

export type OrderItemOptionalDefaults = z.infer<typeof OrderItemOptionalDefaultsSchema>

/////////////////////////////////////////
// ORDER ITEM ADDON SCHEMA
/////////////////////////////////////////

export const OrderItemAddonSchema = z.object({
  id: z.uuid(),
  menuAddonId: z.string(),
  orderItemId: z.string(),
  quantity: z.number().int(),
  total: z.number().int(),
})

export type OrderItemAddon = z.infer<typeof OrderItemAddonSchema>

/////////////////////////////////////////
// ORDER ITEM ADDON PARTIAL SCHEMA
/////////////////////////////////////////

export const OrderItemAddonPartialSchema = OrderItemAddonSchema.partial()

export type OrderItemAddonPartial = z.infer<typeof OrderItemAddonPartialSchema>

// ORDER ITEM ADDON OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const OrderItemAddonOptionalDefaultsSchema = OrderItemAddonSchema.merge(z.object({
  id: z.uuid().optional(),
}))

export type OrderItemAddonOptionalDefaults = z.infer<typeof OrderItemAddonOptionalDefaultsSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  userRole: z.union([z.boolean(),z.lazy(() => UserRoleFindManyArgsSchema)]).optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  userRole: z.boolean().optional(),
  accounts: z.boolean().optional(),
  sessions: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  image: z.boolean().optional(),
  address: z.boolean().optional(),
  phoneNumber: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  locationId: z.boolean().optional(),
  userRole: z.union([z.boolean(),z.lazy(() => UserRoleFindManyArgsSchema)]).optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z.object({
  select: z.lazy(() => AccountSelectSchema).optional(),
  include: z.lazy(() => AccountIncludeSchema).optional(),
}).strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  accountId: z.boolean().optional(),
  providerId: z.boolean().optional(),
  accessToken: z.boolean().optional(),
  refreshToken: z.boolean().optional(),
  idToken: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  password: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  ipAddress: z.boolean().optional(),
  userAgent: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// VERIFICATION
//------------------------------------------------------

export const VerificationSelectSchema: z.ZodType<Prisma.VerificationSelect> = z.object({
  id: z.boolean().optional(),
  identifier: z.boolean().optional(),
  value: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
}).strict()

// ROLE
//------------------------------------------------------

export const RoleIncludeSchema: z.ZodType<Prisma.RoleInclude> = z.object({
  userRole: z.union([z.boolean(),z.lazy(() => UserRoleFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RoleCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const RoleArgsSchema: z.ZodType<Prisma.RoleDefaultArgs> = z.object({
  select: z.lazy(() => RoleSelectSchema).optional(),
  include: z.lazy(() => RoleIncludeSchema).optional(),
}).strict();

export const RoleCountOutputTypeArgsSchema: z.ZodType<Prisma.RoleCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => RoleCountOutputTypeSelectSchema).nullish(),
}).strict();

export const RoleCountOutputTypeSelectSchema: z.ZodType<Prisma.RoleCountOutputTypeSelect> = z.object({
  userRole: z.boolean().optional(),
}).strict();

export const RoleSelectSchema: z.ZodType<Prisma.RoleSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  userRole: z.union([z.boolean(),z.lazy(() => UserRoleFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RoleCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER ROLE
//------------------------------------------------------

export const UserRoleIncludeSchema: z.ZodType<Prisma.UserRoleInclude> = z.object({
  User: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  Role: z.union([z.boolean(),z.lazy(() => RoleArgsSchema)]).optional(),
}).strict();

export const UserRoleArgsSchema: z.ZodType<Prisma.UserRoleDefaultArgs> = z.object({
  select: z.lazy(() => UserRoleSelectSchema).optional(),
  include: z.lazy(() => UserRoleIncludeSchema).optional(),
}).strict();

export const UserRoleSelectSchema: z.ZodType<Prisma.UserRoleSelect> = z.object({
  id: z.boolean().optional(),
  roleId: z.boolean().optional(),
  userId: z.boolean().optional(),
  User: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  Role: z.union([z.boolean(),z.lazy(() => RoleArgsSchema)]).optional(),
}).strict()

// CATEGORY
//------------------------------------------------------

export const CategoryIncludeSchema: z.ZodType<Prisma.CategoryInclude> = z.object({
  Menu: z.union([z.boolean(),z.lazy(() => MenuFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const CategoryArgsSchema: z.ZodType<Prisma.CategoryDefaultArgs> = z.object({
  select: z.lazy(() => CategorySelectSchema).optional(),
  include: z.lazy(() => CategoryIncludeSchema).optional(),
}).strict();

export const CategoryCountOutputTypeArgsSchema: z.ZodType<Prisma.CategoryCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CategoryCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CategoryCountOutputTypeSelectSchema: z.ZodType<Prisma.CategoryCountOutputTypeSelect> = z.object({
  Menu: z.boolean().optional(),
}).strict();

export const CategorySelectSchema: z.ZodType<Prisma.CategorySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  Menu: z.union([z.boolean(),z.lazy(() => MenuFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MENU
//------------------------------------------------------

export const MenuIncludeSchema: z.ZodType<Prisma.MenuInclude> = z.object({
  Category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  menuSizes: z.union([z.boolean(),z.lazy(() => MenuSizeFindManyArgsSchema)]).optional(),
  menuAddons: z.union([z.boolean(),z.lazy(() => MenuAddonFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MenuCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const MenuArgsSchema: z.ZodType<Prisma.MenuDefaultArgs> = z.object({
  select: z.lazy(() => MenuSelectSchema).optional(),
  include: z.lazy(() => MenuIncludeSchema).optional(),
}).strict();

export const MenuCountOutputTypeArgsSchema: z.ZodType<Prisma.MenuCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => MenuCountOutputTypeSelectSchema).nullish(),
}).strict();

export const MenuCountOutputTypeSelectSchema: z.ZodType<Prisma.MenuCountOutputTypeSelect> = z.object({
  menuSizes: z.boolean().optional(),
  menuAddons: z.boolean().optional(),
}).strict();

export const MenuSelectSchema: z.ZodType<Prisma.MenuSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  categoryId: z.boolean().optional(),
  Category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  menuSizes: z.union([z.boolean(),z.lazy(() => MenuSizeFindManyArgsSchema)]).optional(),
  menuAddons: z.union([z.boolean(),z.lazy(() => MenuAddonFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MenuCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MENU SIZE
//------------------------------------------------------

export const MenuSizeIncludeSchema: z.ZodType<Prisma.MenuSizeInclude> = z.object({
  OrderItem: z.union([z.boolean(),z.lazy(() => OrderItemFindManyArgsSchema)]).optional(),
  Menu: z.union([z.boolean(),z.lazy(() => MenuArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MenuSizeCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const MenuSizeArgsSchema: z.ZodType<Prisma.MenuSizeDefaultArgs> = z.object({
  select: z.lazy(() => MenuSizeSelectSchema).optional(),
  include: z.lazy(() => MenuSizeIncludeSchema).optional(),
}).strict();

export const MenuSizeCountOutputTypeArgsSchema: z.ZodType<Prisma.MenuSizeCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => MenuSizeCountOutputTypeSelectSchema).nullish(),
}).strict();

export const MenuSizeCountOutputTypeSelectSchema: z.ZodType<Prisma.MenuSizeCountOutputTypeSelect> = z.object({
  OrderItem: z.boolean().optional(),
}).strict();

export const MenuSizeSelectSchema: z.ZodType<Prisma.MenuSizeSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  price: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  menuId: z.boolean().optional(),
  OrderItem: z.union([z.boolean(),z.lazy(() => OrderItemFindManyArgsSchema)]).optional(),
  Menu: z.union([z.boolean(),z.lazy(() => MenuArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MenuSizeCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MENU ADDON
//------------------------------------------------------

export const MenuAddonIncludeSchema: z.ZodType<Prisma.MenuAddonInclude> = z.object({
  OrderItemAddon: z.union([z.boolean(),z.lazy(() => OrderItemAddonFindManyArgsSchema)]).optional(),
  Menu: z.union([z.boolean(),z.lazy(() => MenuArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MenuAddonCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const MenuAddonArgsSchema: z.ZodType<Prisma.MenuAddonDefaultArgs> = z.object({
  select: z.lazy(() => MenuAddonSelectSchema).optional(),
  include: z.lazy(() => MenuAddonIncludeSchema).optional(),
}).strict();

export const MenuAddonCountOutputTypeArgsSchema: z.ZodType<Prisma.MenuAddonCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => MenuAddonCountOutputTypeSelectSchema).nullish(),
}).strict();

export const MenuAddonCountOutputTypeSelectSchema: z.ZodType<Prisma.MenuAddonCountOutputTypeSelect> = z.object({
  OrderItemAddon: z.boolean().optional(),
}).strict();

export const MenuAddonSelectSchema: z.ZodType<Prisma.MenuAddonSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  price: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  menuId: z.boolean().optional(),
  OrderItemAddon: z.union([z.boolean(),z.lazy(() => OrderItemAddonFindManyArgsSchema)]).optional(),
  Menu: z.union([z.boolean(),z.lazy(() => MenuArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => MenuAddonCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ORDER
//------------------------------------------------------

export const OrderIncludeSchema: z.ZodType<Prisma.OrderInclude> = z.object({
  items: z.union([z.boolean(),z.lazy(() => OrderItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrderCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const OrderArgsSchema: z.ZodType<Prisma.OrderDefaultArgs> = z.object({
  select: z.lazy(() => OrderSelectSchema).optional(),
  include: z.lazy(() => OrderIncludeSchema).optional(),
}).strict();

export const OrderCountOutputTypeArgsSchema: z.ZodType<Prisma.OrderCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => OrderCountOutputTypeSelectSchema).nullish(),
}).strict();

export const OrderCountOutputTypeSelectSchema: z.ZodType<Prisma.OrderCountOutputTypeSelect> = z.object({
  items: z.boolean().optional(),
}).strict();

export const OrderSelectSchema: z.ZodType<Prisma.OrderSelect> = z.object({
  id: z.boolean().optional(),
  total: z.boolean().optional(),
  customerName: z.boolean().optional(),
  paymentStatus: z.boolean().optional(),
  orderStatus: z.boolean().optional(),
  specialInstruction: z.boolean().optional(),
  items: z.union([z.boolean(),z.lazy(() => OrderItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrderCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ORDER ITEM
//------------------------------------------------------

export const OrderItemIncludeSchema: z.ZodType<Prisma.OrderItemInclude> = z.object({
  itemAddons: z.union([z.boolean(),z.lazy(() => OrderItemAddonFindManyArgsSchema)]).optional(),
  Order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
  MenuSize: z.union([z.boolean(),z.lazy(() => MenuSizeArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrderItemCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const OrderItemArgsSchema: z.ZodType<Prisma.OrderItemDefaultArgs> = z.object({
  select: z.lazy(() => OrderItemSelectSchema).optional(),
  include: z.lazy(() => OrderItemIncludeSchema).optional(),
}).strict();

export const OrderItemCountOutputTypeArgsSchema: z.ZodType<Prisma.OrderItemCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => OrderItemCountOutputTypeSelectSchema).nullish(),
}).strict();

export const OrderItemCountOutputTypeSelectSchema: z.ZodType<Prisma.OrderItemCountOutputTypeSelect> = z.object({
  itemAddons: z.boolean().optional(),
}).strict();

export const OrderItemSelectSchema: z.ZodType<Prisma.OrderItemSelect> = z.object({
  id: z.boolean().optional(),
  menuSizeId: z.boolean().optional(),
  quantity: z.boolean().optional(),
  total: z.boolean().optional(),
  orderId: z.boolean().optional(),
  itemAddons: z.union([z.boolean(),z.lazy(() => OrderItemAddonFindManyArgsSchema)]).optional(),
  Order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
  MenuSize: z.union([z.boolean(),z.lazy(() => MenuSizeArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrderItemCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ORDER ITEM ADDON
//------------------------------------------------------

export const OrderItemAddonIncludeSchema: z.ZodType<Prisma.OrderItemAddonInclude> = z.object({
  OrderItem: z.union([z.boolean(),z.lazy(() => OrderItemArgsSchema)]).optional(),
  MenuAddon: z.union([z.boolean(),z.lazy(() => MenuAddonArgsSchema)]).optional(),
}).strict();

export const OrderItemAddonArgsSchema: z.ZodType<Prisma.OrderItemAddonDefaultArgs> = z.object({
  select: z.lazy(() => OrderItemAddonSelectSchema).optional(),
  include: z.lazy(() => OrderItemAddonIncludeSchema).optional(),
}).strict();

export const OrderItemAddonSelectSchema: z.ZodType<Prisma.OrderItemAddonSelect> = z.object({
  id: z.boolean().optional(),
  menuAddonId: z.boolean().optional(),
  orderItemId: z.boolean().optional(),
  quantity: z.boolean().optional(),
  total: z.boolean().optional(),
  OrderItem: z.union([z.boolean(),z.lazy(() => OrderItemArgsSchema)]).optional(),
  MenuAddon: z.union([z.boolean(),z.lazy(() => MenuAddonArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  locationId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  userRole: z.lazy(() => UserRoleListRelationFilterSchema).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
});

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  phoneNumber: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  userRole: z.lazy(() => UserRoleOrderByRelationAggregateInputSchema).optional(),
  accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
  sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
});

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    email: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.strictObject({
  id: z.uuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  locationId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  userRole: z.lazy(() => UserRoleListRelationFilterSchema).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
}));

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  phoneNumber: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
});

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  image: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  phoneNumber: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  locationId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  accountId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  providerId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  accessToken: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  refreshToken: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  idToken: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  expiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  refreshToken: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  idToken: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  expiresAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  accountId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  providerId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  accessToken: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  refreshToken: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  idToken: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  expiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  refreshToken: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  idToken: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  expiresAt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
});

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema), z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema), z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  accountId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  providerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  accessToken: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  refreshToken: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  idToken: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  expiresAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  userAgent: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  userAgent: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional(),
});

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema), z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema), z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const VerificationWhereInputSchema: z.ZodType<Prisma.VerificationWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => VerificationWhereInputSchema), z.lazy(() => VerificationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationWhereInputSchema), z.lazy(() => VerificationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const VerificationOrderByWithRelationInputSchema: z.ZodType<Prisma.VerificationOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
});

export const VerificationWhereUniqueInputSchema: z.ZodType<Prisma.VerificationWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    identifier_value: z.lazy(() => VerificationIdentifierValueCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    identifier_value: z.lazy(() => VerificationIdentifierValueCompoundUniqueInputSchema),
  }),
])
.and(z.strictObject({
  id: z.uuid().optional(),
  identifier_value: z.lazy(() => VerificationIdentifierValueCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => VerificationWhereInputSchema), z.lazy(() => VerificationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationWhereInputSchema), z.lazy(() => VerificationWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}));

export const VerificationOrderByWithAggregationInputSchema: z.ZodType<Prisma.VerificationOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => VerificationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VerificationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VerificationMinOrderByAggregateInputSchema).optional(),
});

export const VerificationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VerificationScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema), z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema), z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  identifier: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const RoleWhereInputSchema: z.ZodType<Prisma.RoleWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => RoleWhereInputSchema), z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoleWhereInputSchema), z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userRole: z.lazy(() => UserRoleListRelationFilterSchema).optional(),
});

export const RoleOrderByWithRelationInputSchema: z.ZodType<Prisma.RoleOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userRole: z.lazy(() => UserRoleOrderByRelationAggregateInputSchema).optional(),
});

export const RoleWhereUniqueInputSchema: z.ZodType<Prisma.RoleWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => RoleWhereInputSchema), z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoleWhereInputSchema), z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userRole: z.lazy(() => UserRoleListRelationFilterSchema).optional(),
}));

export const RoleOrderByWithAggregationInputSchema: z.ZodType<Prisma.RoleOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RoleCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RoleMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RoleMinOrderByAggregateInputSchema).optional(),
});

export const RoleScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RoleScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => RoleScalarWhereWithAggregatesInputSchema), z.lazy(() => RoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoleScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoleScalarWhereWithAggregatesInputSchema), z.lazy(() => RoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const UserRoleWhereInputSchema: z.ZodType<Prisma.UserRoleWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserRoleWhereInputSchema), z.lazy(() => UserRoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRoleWhereInputSchema), z.lazy(() => UserRoleWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  roleId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  User: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  Role: z.union([ z.lazy(() => RoleScalarRelationFilterSchema), z.lazy(() => RoleWhereInputSchema) ]).optional(),
});

export const UserRoleOrderByWithRelationInputSchema: z.ZodType<Prisma.UserRoleOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  User: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  Role: z.lazy(() => RoleOrderByWithRelationInputSchema).optional(),
});

export const UserRoleWhereUniqueInputSchema: z.ZodType<Prisma.UserRoleWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => UserRoleWhereInputSchema), z.lazy(() => UserRoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRoleWhereInputSchema), z.lazy(() => UserRoleWhereInputSchema).array() ]).optional(),
  roleId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  User: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  Role: z.union([ z.lazy(() => RoleScalarRelationFilterSchema), z.lazy(() => RoleWhereInputSchema) ]).optional(),
}));

export const UserRoleOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserRoleOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserRoleCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserRoleMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserRoleMinOrderByAggregateInputSchema).optional(),
});

export const UserRoleScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserRoleScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema), z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema), z.lazy(() => UserRoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  roleId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const CategoryWhereInputSchema: z.ZodType<Prisma.CategoryWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema), z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema), z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  Menu: z.lazy(() => MenuListRelationFilterSchema).optional(),
});

export const CategoryOrderByWithRelationInputSchema: z.ZodType<Prisma.CategoryOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  Menu: z.lazy(() => MenuOrderByRelationAggregateInputSchema).optional(),
});

export const CategoryWhereUniqueInputSchema: z.ZodType<Prisma.CategoryWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema), z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema), z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  Menu: z.lazy(() => MenuListRelationFilterSchema).optional(),
}));

export const CategoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.CategoryOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CategoryCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CategoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CategoryMinOrderByAggregateInputSchema).optional(),
});

export const CategoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CategoryScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema), z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema), z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const MenuWhereInputSchema: z.ZodType<Prisma.MenuWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MenuWhereInputSchema), z.lazy(() => MenuWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MenuWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MenuWhereInputSchema), z.lazy(() => MenuWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  Category: z.union([ z.lazy(() => CategoryScalarRelationFilterSchema), z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  menuSizes: z.lazy(() => MenuSizeListRelationFilterSchema).optional(),
  menuAddons: z.lazy(() => MenuAddonListRelationFilterSchema).optional(),
});

export const MenuOrderByWithRelationInputSchema: z.ZodType<Prisma.MenuOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  Category: z.lazy(() => CategoryOrderByWithRelationInputSchema).optional(),
  menuSizes: z.lazy(() => MenuSizeOrderByRelationAggregateInputSchema).optional(),
  menuAddons: z.lazy(() => MenuAddonOrderByRelationAggregateInputSchema).optional(),
});

export const MenuWhereUniqueInputSchema: z.ZodType<Prisma.MenuWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => MenuWhereInputSchema), z.lazy(() => MenuWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MenuWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MenuWhereInputSchema), z.lazy(() => MenuWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  Category: z.union([ z.lazy(() => CategoryScalarRelationFilterSchema), z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  menuSizes: z.lazy(() => MenuSizeListRelationFilterSchema).optional(),
  menuAddons: z.lazy(() => MenuAddonListRelationFilterSchema).optional(),
}));

export const MenuOrderByWithAggregationInputSchema: z.ZodType<Prisma.MenuOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MenuCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MenuMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MenuMinOrderByAggregateInputSchema).optional(),
});

export const MenuScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MenuScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MenuScalarWhereWithAggregatesInputSchema), z.lazy(() => MenuScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MenuScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MenuScalarWhereWithAggregatesInputSchema), z.lazy(() => MenuScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const MenuSizeWhereInputSchema: z.ZodType<Prisma.MenuSizeWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MenuSizeWhereInputSchema), z.lazy(() => MenuSizeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MenuSizeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MenuSizeWhereInputSchema), z.lazy(() => MenuSizeWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  isAvailable: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  menuId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  OrderItem: z.lazy(() => OrderItemListRelationFilterSchema).optional(),
  Menu: z.union([ z.lazy(() => MenuScalarRelationFilterSchema), z.lazy(() => MenuWhereInputSchema) ]).optional(),
});

export const MenuSizeOrderByWithRelationInputSchema: z.ZodType<Prisma.MenuSizeOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  isAvailable: z.lazy(() => SortOrderSchema).optional(),
  menuId: z.lazy(() => SortOrderSchema).optional(),
  OrderItem: z.lazy(() => OrderItemOrderByRelationAggregateInputSchema).optional(),
  Menu: z.lazy(() => MenuOrderByWithRelationInputSchema).optional(),
});

export const MenuSizeWhereUniqueInputSchema: z.ZodType<Prisma.MenuSizeWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => MenuSizeWhereInputSchema), z.lazy(() => MenuSizeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MenuSizeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MenuSizeWhereInputSchema), z.lazy(() => MenuSizeWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  isAvailable: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  menuId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  OrderItem: z.lazy(() => OrderItemListRelationFilterSchema).optional(),
  Menu: z.union([ z.lazy(() => MenuScalarRelationFilterSchema), z.lazy(() => MenuWhereInputSchema) ]).optional(),
}));

export const MenuSizeOrderByWithAggregationInputSchema: z.ZodType<Prisma.MenuSizeOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  isAvailable: z.lazy(() => SortOrderSchema).optional(),
  menuId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MenuSizeCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MenuSizeAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MenuSizeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MenuSizeMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MenuSizeSumOrderByAggregateInputSchema).optional(),
});

export const MenuSizeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MenuSizeScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MenuSizeScalarWhereWithAggregatesInputSchema), z.lazy(() => MenuSizeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MenuSizeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MenuSizeScalarWhereWithAggregatesInputSchema), z.lazy(() => MenuSizeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  isAvailable: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  menuId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const MenuAddonWhereInputSchema: z.ZodType<Prisma.MenuAddonWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MenuAddonWhereInputSchema), z.lazy(() => MenuAddonWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MenuAddonWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MenuAddonWhereInputSchema), z.lazy(() => MenuAddonWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  isAvailable: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  menuId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  OrderItemAddon: z.lazy(() => OrderItemAddonListRelationFilterSchema).optional(),
  Menu: z.union([ z.lazy(() => MenuScalarRelationFilterSchema), z.lazy(() => MenuWhereInputSchema) ]).optional(),
});

export const MenuAddonOrderByWithRelationInputSchema: z.ZodType<Prisma.MenuAddonOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  isAvailable: z.lazy(() => SortOrderSchema).optional(),
  menuId: z.lazy(() => SortOrderSchema).optional(),
  OrderItemAddon: z.lazy(() => OrderItemAddonOrderByRelationAggregateInputSchema).optional(),
  Menu: z.lazy(() => MenuOrderByWithRelationInputSchema).optional(),
});

export const MenuAddonWhereUniqueInputSchema: z.ZodType<Prisma.MenuAddonWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => MenuAddonWhereInputSchema), z.lazy(() => MenuAddonWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MenuAddonWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MenuAddonWhereInputSchema), z.lazy(() => MenuAddonWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  isAvailable: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  menuId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  OrderItemAddon: z.lazy(() => OrderItemAddonListRelationFilterSchema).optional(),
  Menu: z.union([ z.lazy(() => MenuScalarRelationFilterSchema), z.lazy(() => MenuWhereInputSchema) ]).optional(),
}));

export const MenuAddonOrderByWithAggregationInputSchema: z.ZodType<Prisma.MenuAddonOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  isAvailable: z.lazy(() => SortOrderSchema).optional(),
  menuId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MenuAddonCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MenuAddonAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MenuAddonMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MenuAddonMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MenuAddonSumOrderByAggregateInputSchema).optional(),
});

export const MenuAddonScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MenuAddonScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MenuAddonScalarWhereWithAggregatesInputSchema), z.lazy(() => MenuAddonScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MenuAddonScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MenuAddonScalarWhereWithAggregatesInputSchema), z.lazy(() => MenuAddonScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  isAvailable: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  menuId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const OrderWhereInputSchema: z.ZodType<Prisma.OrderWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrderWhereInputSchema), z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderWhereInputSchema), z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  total: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  customerName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  paymentStatus: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  orderStatus: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  specialInstruction: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  items: z.lazy(() => OrderItemListRelationFilterSchema).optional(),
});

export const OrderOrderByWithRelationInputSchema: z.ZodType<Prisma.OrderOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  customerName: z.lazy(() => SortOrderSchema).optional(),
  paymentStatus: z.lazy(() => SortOrderSchema).optional(),
  orderStatus: z.lazy(() => SortOrderSchema).optional(),
  specialInstruction: z.lazy(() => SortOrderSchema).optional(),
  items: z.lazy(() => OrderItemOrderByRelationAggregateInputSchema).optional(),
});

export const OrderWhereUniqueInputSchema: z.ZodType<Prisma.OrderWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => OrderWhereInputSchema), z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderWhereInputSchema), z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  total: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  customerName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  paymentStatus: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  orderStatus: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  specialInstruction: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  items: z.lazy(() => OrderItemListRelationFilterSchema).optional(),
}));

export const OrderOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrderOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  customerName: z.lazy(() => SortOrderSchema).optional(),
  paymentStatus: z.lazy(() => SortOrderSchema).optional(),
  orderStatus: z.lazy(() => SortOrderSchema).optional(),
  specialInstruction: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrderCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OrderAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrderMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrderMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OrderSumOrderByAggregateInputSchema).optional(),
});

export const OrderScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrderScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrderScalarWhereWithAggregatesInputSchema), z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderScalarWhereWithAggregatesInputSchema), z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  total: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  customerName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  paymentStatus: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  orderStatus: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  specialInstruction: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const OrderItemWhereInputSchema: z.ZodType<Prisma.OrderItemWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrderItemWhereInputSchema), z.lazy(() => OrderItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemWhereInputSchema), z.lazy(() => OrderItemWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  menuSizeId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  total: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  orderId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  itemAddons: z.lazy(() => OrderItemAddonListRelationFilterSchema).optional(),
  Order: z.union([ z.lazy(() => OrderScalarRelationFilterSchema), z.lazy(() => OrderWhereInputSchema) ]).optional(),
  MenuSize: z.union([ z.lazy(() => MenuSizeScalarRelationFilterSchema), z.lazy(() => MenuSizeWhereInputSchema) ]).optional(),
});

export const OrderItemOrderByWithRelationInputSchema: z.ZodType<Prisma.OrderItemOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  menuSizeId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
  itemAddons: z.lazy(() => OrderItemAddonOrderByRelationAggregateInputSchema).optional(),
  Order: z.lazy(() => OrderOrderByWithRelationInputSchema).optional(),
  MenuSize: z.lazy(() => MenuSizeOrderByWithRelationInputSchema).optional(),
});

export const OrderItemWhereUniqueInputSchema: z.ZodType<Prisma.OrderItemWhereUniqueInput> = z.object({
  id: z.string(),
})
.and(z.strictObject({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => OrderItemWhereInputSchema), z.lazy(() => OrderItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemWhereInputSchema), z.lazy(() => OrderItemWhereInputSchema).array() ]).optional(),
  menuSizeId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  total: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  orderId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  itemAddons: z.lazy(() => OrderItemAddonListRelationFilterSchema).optional(),
  Order: z.union([ z.lazy(() => OrderScalarRelationFilterSchema), z.lazy(() => OrderWhereInputSchema) ]).optional(),
  MenuSize: z.union([ z.lazy(() => MenuSizeScalarRelationFilterSchema), z.lazy(() => MenuSizeWhereInputSchema) ]).optional(),
}));

export const OrderItemOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrderItemOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  menuSizeId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrderItemCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OrderItemAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrderItemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrderItemMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OrderItemSumOrderByAggregateInputSchema).optional(),
});

export const OrderItemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrderItemScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema), z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema), z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  menuSizeId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  total: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  orderId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const OrderItemAddonWhereInputSchema: z.ZodType<Prisma.OrderItemAddonWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrderItemAddonWhereInputSchema), z.lazy(() => OrderItemAddonWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemAddonWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemAddonWhereInputSchema), z.lazy(() => OrderItemAddonWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  menuAddonId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  orderItemId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  total: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  OrderItem: z.union([ z.lazy(() => OrderItemScalarRelationFilterSchema), z.lazy(() => OrderItemWhereInputSchema) ]).optional(),
  MenuAddon: z.union([ z.lazy(() => MenuAddonScalarRelationFilterSchema), z.lazy(() => MenuAddonWhereInputSchema) ]).optional(),
});

export const OrderItemAddonOrderByWithRelationInputSchema: z.ZodType<Prisma.OrderItemAddonOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  menuAddonId: z.lazy(() => SortOrderSchema).optional(),
  orderItemId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  OrderItem: z.lazy(() => OrderItemOrderByWithRelationInputSchema).optional(),
  MenuAddon: z.lazy(() => MenuAddonOrderByWithRelationInputSchema).optional(),
});

export const OrderItemAddonWhereUniqueInputSchema: z.ZodType<Prisma.OrderItemAddonWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => OrderItemAddonWhereInputSchema), z.lazy(() => OrderItemAddonWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemAddonWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemAddonWhereInputSchema), z.lazy(() => OrderItemAddonWhereInputSchema).array() ]).optional(),
  menuAddonId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  orderItemId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  total: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  OrderItem: z.union([ z.lazy(() => OrderItemScalarRelationFilterSchema), z.lazy(() => OrderItemWhereInputSchema) ]).optional(),
  MenuAddon: z.union([ z.lazy(() => MenuAddonScalarRelationFilterSchema), z.lazy(() => MenuAddonWhereInputSchema) ]).optional(),
}));

export const OrderItemAddonOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrderItemAddonOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  menuAddonId: z.lazy(() => SortOrderSchema).optional(),
  orderItemId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrderItemAddonCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OrderItemAddonAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrderItemAddonMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrderItemAddonMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OrderItemAddonSumOrderByAggregateInputSchema).optional(),
});

export const OrderItemAddonScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrderItemAddonScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrderItemAddonScalarWhereWithAggregatesInputSchema), z.lazy(() => OrderItemAddonScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemAddonScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemAddonScalarWhereWithAggregatesInputSchema), z.lazy(() => OrderItemAddonScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  menuAddonId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  orderItemId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  total: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  image: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  locationId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  image: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  locationId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.lazy(() => UserRoleUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.lazy(() => UserRoleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  image: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  locationId: z.string().optional().nullable(),
});

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  password: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema),
});

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  password: z.string().optional().nullable(),
});

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional(),
});

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  password: z.string().optional().nullable(),
});

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  expiresAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema),
});

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
  expiresAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
});

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional(),
});

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
  expiresAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
});

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const VerificationCreateInputSchema: z.ZodType<Prisma.VerificationCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.coerce.date(),
});

export const VerificationUncheckedCreateInputSchema: z.ZodType<Prisma.VerificationUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.coerce.date(),
});

export const VerificationUpdateInputSchema: z.ZodType<Prisma.VerificationUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const VerificationUncheckedUpdateInputSchema: z.ZodType<Prisma.VerificationUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const VerificationCreateManyInputSchema: z.ZodType<Prisma.VerificationCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  identifier: z.string(),
  value: z.string(),
  expiresAt: z.coerce.date(),
});

export const VerificationUpdateManyMutationInputSchema: z.ZodType<Prisma.VerificationUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const VerificationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VerificationUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const RoleCreateInputSchema: z.ZodType<Prisma.RoleCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  userRole: z.lazy(() => UserRoleCreateNestedManyWithoutRoleInputSchema).optional(),
});

export const RoleUncheckedCreateInputSchema: z.ZodType<Prisma.RoleUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  userRole: z.lazy(() => UserRoleUncheckedCreateNestedManyWithoutRoleInputSchema).optional(),
});

export const RoleUpdateInputSchema: z.ZodType<Prisma.RoleUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userRole: z.lazy(() => UserRoleUpdateManyWithoutRoleNestedInputSchema).optional(),
});

export const RoleUncheckedUpdateInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userRole: z.lazy(() => UserRoleUncheckedUpdateManyWithoutRoleNestedInputSchema).optional(),
});

export const RoleCreateManyInputSchema: z.ZodType<Prisma.RoleCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
});

export const RoleUpdateManyMutationInputSchema: z.ZodType<Prisma.RoleUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const RoleUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserRoleCreateInputSchema: z.ZodType<Prisma.UserRoleCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  User: z.lazy(() => UserCreateNestedOneWithoutUserRoleInputSchema),
  Role: z.lazy(() => RoleCreateNestedOneWithoutUserRoleInputSchema),
});

export const UserRoleUncheckedCreateInputSchema: z.ZodType<Prisma.UserRoleUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  roleId: z.string(),
  userId: z.string(),
});

export const UserRoleUpdateInputSchema: z.ZodType<Prisma.UserRoleUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUpdateOneRequiredWithoutUserRoleNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateOneRequiredWithoutUserRoleNestedInputSchema).optional(),
});

export const UserRoleUncheckedUpdateInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserRoleCreateManyInputSchema: z.ZodType<Prisma.UserRoleCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  roleId: z.string(),
  userId: z.string(),
});

export const UserRoleUpdateManyMutationInputSchema: z.ZodType<Prisma.UserRoleUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserRoleUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CategoryCreateInputSchema: z.ZodType<Prisma.CategoryCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  Menu: z.lazy(() => MenuCreateNestedManyWithoutCategoryInputSchema).optional(),
});

export const CategoryUncheckedCreateInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  Menu: z.lazy(() => MenuUncheckedCreateNestedManyWithoutCategoryInputSchema).optional(),
});

export const CategoryUpdateInputSchema: z.ZodType<Prisma.CategoryUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Menu: z.lazy(() => MenuUpdateManyWithoutCategoryNestedInputSchema).optional(),
});

export const CategoryUncheckedUpdateInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Menu: z.lazy(() => MenuUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional(),
});

export const CategoryCreateManyInputSchema: z.ZodType<Prisma.CategoryCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
});

export const CategoryUpdateManyMutationInputSchema: z.ZodType<Prisma.CategoryUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CategoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MenuCreateInputSchema: z.ZodType<Prisma.MenuCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  Category: z.lazy(() => CategoryCreateNestedOneWithoutMenuInputSchema),
  menuSizes: z.lazy(() => MenuSizeCreateNestedManyWithoutMenuInputSchema).optional(),
  menuAddons: z.lazy(() => MenuAddonCreateNestedManyWithoutMenuInputSchema).optional(),
});

export const MenuUncheckedCreateInputSchema: z.ZodType<Prisma.MenuUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  categoryId: z.string(),
  menuSizes: z.lazy(() => MenuSizeUncheckedCreateNestedManyWithoutMenuInputSchema).optional(),
  menuAddons: z.lazy(() => MenuAddonUncheckedCreateNestedManyWithoutMenuInputSchema).optional(),
});

export const MenuUpdateInputSchema: z.ZodType<Prisma.MenuUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Category: z.lazy(() => CategoryUpdateOneRequiredWithoutMenuNestedInputSchema).optional(),
  menuSizes: z.lazy(() => MenuSizeUpdateManyWithoutMenuNestedInputSchema).optional(),
  menuAddons: z.lazy(() => MenuAddonUpdateManyWithoutMenuNestedInputSchema).optional(),
});

export const MenuUncheckedUpdateInputSchema: z.ZodType<Prisma.MenuUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  menuSizes: z.lazy(() => MenuSizeUncheckedUpdateManyWithoutMenuNestedInputSchema).optional(),
  menuAddons: z.lazy(() => MenuAddonUncheckedUpdateManyWithoutMenuNestedInputSchema).optional(),
});

export const MenuCreateManyInputSchema: z.ZodType<Prisma.MenuCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  categoryId: z.string(),
});

export const MenuUpdateManyMutationInputSchema: z.ZodType<Prisma.MenuUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MenuUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MenuUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MenuSizeCreateInputSchema: z.ZodType<Prisma.MenuSizeCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  OrderItem: z.lazy(() => OrderItemCreateNestedManyWithoutMenuSizeInputSchema).optional(),
  Menu: z.lazy(() => MenuCreateNestedOneWithoutMenuSizesInputSchema),
});

export const MenuSizeUncheckedCreateInputSchema: z.ZodType<Prisma.MenuSizeUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  menuId: z.string(),
  OrderItem: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutMenuSizeInputSchema).optional(),
});

export const MenuSizeUpdateInputSchema: z.ZodType<Prisma.MenuSizeUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  OrderItem: z.lazy(() => OrderItemUpdateManyWithoutMenuSizeNestedInputSchema).optional(),
  Menu: z.lazy(() => MenuUpdateOneRequiredWithoutMenuSizesNestedInputSchema).optional(),
});

export const MenuSizeUncheckedUpdateInputSchema: z.ZodType<Prisma.MenuSizeUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  menuId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  OrderItem: z.lazy(() => OrderItemUncheckedUpdateManyWithoutMenuSizeNestedInputSchema).optional(),
});

export const MenuSizeCreateManyInputSchema: z.ZodType<Prisma.MenuSizeCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  menuId: z.string(),
});

export const MenuSizeUpdateManyMutationInputSchema: z.ZodType<Prisma.MenuSizeUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MenuSizeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MenuSizeUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  menuId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MenuAddonCreateInputSchema: z.ZodType<Prisma.MenuAddonCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  OrderItemAddon: z.lazy(() => OrderItemAddonCreateNestedManyWithoutMenuAddonInputSchema).optional(),
  Menu: z.lazy(() => MenuCreateNestedOneWithoutMenuAddonsInputSchema),
});

export const MenuAddonUncheckedCreateInputSchema: z.ZodType<Prisma.MenuAddonUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  menuId: z.string(),
  OrderItemAddon: z.lazy(() => OrderItemAddonUncheckedCreateNestedManyWithoutMenuAddonInputSchema).optional(),
});

export const MenuAddonUpdateInputSchema: z.ZodType<Prisma.MenuAddonUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  OrderItemAddon: z.lazy(() => OrderItemAddonUpdateManyWithoutMenuAddonNestedInputSchema).optional(),
  Menu: z.lazy(() => MenuUpdateOneRequiredWithoutMenuAddonsNestedInputSchema).optional(),
});

export const MenuAddonUncheckedUpdateInputSchema: z.ZodType<Prisma.MenuAddonUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  menuId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  OrderItemAddon: z.lazy(() => OrderItemAddonUncheckedUpdateManyWithoutMenuAddonNestedInputSchema).optional(),
});

export const MenuAddonCreateManyInputSchema: z.ZodType<Prisma.MenuAddonCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  menuId: z.string(),
});

export const MenuAddonUpdateManyMutationInputSchema: z.ZodType<Prisma.MenuAddonUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MenuAddonUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MenuAddonUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  menuId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderCreateInputSchema: z.ZodType<Prisma.OrderCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  total: z.number(),
  customerName: z.string(),
  paymentStatus: z.string(),
  orderStatus: z.string(),
  specialInstruction: z.string(),
  items: z.lazy(() => OrderItemCreateNestedManyWithoutOrderInputSchema).optional(),
});

export const OrderUncheckedCreateInputSchema: z.ZodType<Prisma.OrderUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  total: z.number(),
  customerName: z.string(),
  paymentStatus: z.string(),
  orderStatus: z.string(),
  specialInstruction: z.string(),
  items: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
});

export const OrderUpdateInputSchema: z.ZodType<Prisma.OrderUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentStatus: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderStatus: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  specialInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => OrderItemUpdateManyWithoutOrderNestedInputSchema).optional(),
});

export const OrderUncheckedUpdateInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentStatus: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderStatus: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  specialInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
});

export const OrderCreateManyInputSchema: z.ZodType<Prisma.OrderCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  total: z.number(),
  customerName: z.string(),
  paymentStatus: z.string(),
  orderStatus: z.string(),
  specialInstruction: z.string(),
});

export const OrderUpdateManyMutationInputSchema: z.ZodType<Prisma.OrderUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentStatus: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderStatus: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  specialInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentStatus: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderStatus: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  specialInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemCreateInputSchema: z.ZodType<Prisma.OrderItemCreateInput> = z.strictObject({
  id: z.string().optional(),
  quantity: z.number(),
  total: z.number(),
  itemAddons: z.lazy(() => OrderItemAddonCreateNestedManyWithoutOrderItemInputSchema).optional(),
  Order: z.lazy(() => OrderCreateNestedOneWithoutItemsInputSchema),
  MenuSize: z.lazy(() => MenuSizeCreateNestedOneWithoutOrderItemInputSchema),
});

export const OrderItemUncheckedCreateInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateInput> = z.strictObject({
  id: z.string().optional(),
  menuSizeId: z.string(),
  quantity: z.number(),
  total: z.number(),
  orderId: z.string(),
  itemAddons: z.lazy(() => OrderItemAddonUncheckedCreateNestedManyWithoutOrderItemInputSchema).optional(),
});

export const OrderItemUpdateInputSchema: z.ZodType<Prisma.OrderItemUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  itemAddons: z.lazy(() => OrderItemAddonUpdateManyWithoutOrderItemNestedInputSchema).optional(),
  Order: z.lazy(() => OrderUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
  MenuSize: z.lazy(() => MenuSizeUpdateOneRequiredWithoutOrderItemNestedInputSchema).optional(),
});

export const OrderItemUncheckedUpdateInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  menuSizeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  itemAddons: z.lazy(() => OrderItemAddonUncheckedUpdateManyWithoutOrderItemNestedInputSchema).optional(),
});

export const OrderItemCreateManyInputSchema: z.ZodType<Prisma.OrderItemCreateManyInput> = z.strictObject({
  id: z.string().optional(),
  menuSizeId: z.string(),
  quantity: z.number(),
  total: z.number(),
  orderId: z.string(),
});

export const OrderItemUpdateManyMutationInputSchema: z.ZodType<Prisma.OrderItemUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  menuSizeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemAddonCreateInputSchema: z.ZodType<Prisma.OrderItemAddonCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  quantity: z.number(),
  total: z.number(),
  OrderItem: z.lazy(() => OrderItemCreateNestedOneWithoutItemAddonsInputSchema),
  MenuAddon: z.lazy(() => MenuAddonCreateNestedOneWithoutOrderItemAddonInputSchema),
});

export const OrderItemAddonUncheckedCreateInputSchema: z.ZodType<Prisma.OrderItemAddonUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  menuAddonId: z.string(),
  orderItemId: z.string(),
  quantity: z.number(),
  total: z.number(),
});

export const OrderItemAddonUpdateInputSchema: z.ZodType<Prisma.OrderItemAddonUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  OrderItem: z.lazy(() => OrderItemUpdateOneRequiredWithoutItemAddonsNestedInputSchema).optional(),
  MenuAddon: z.lazy(() => MenuAddonUpdateOneRequiredWithoutOrderItemAddonNestedInputSchema).optional(),
});

export const OrderItemAddonUncheckedUpdateInputSchema: z.ZodType<Prisma.OrderItemAddonUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  menuAddonId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemAddonCreateManyInputSchema: z.ZodType<Prisma.OrderItemAddonCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  menuAddonId: z.string(),
  orderItemId: z.string(),
  quantity: z.number(),
  total: z.number(),
});

export const OrderItemAddonUpdateManyMutationInputSchema: z.ZodType<Prisma.OrderItemAddonUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemAddonUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrderItemAddonUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  menuAddonId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const UserRoleListRelationFilterSchema: z.ZodType<Prisma.UserRoleListRelationFilter> = z.strictObject({
  every: z.lazy(() => UserRoleWhereInputSchema).optional(),
  some: z.lazy(() => UserRoleWhereInputSchema).optional(),
  none: z.lazy(() => UserRoleWhereInputSchema).optional(),
});

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> = z.strictObject({
  every: z.lazy(() => AccountWhereInputSchema).optional(),
  some: z.lazy(() => AccountWhereInputSchema).optional(),
  none: z.lazy(() => AccountWhereInputSchema).optional(),
});

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z.strictObject({
  every: z.lazy(() => SessionWhereInputSchema).optional(),
  some: z.lazy(() => SessionWhereInputSchema).optional(),
  none: z.lazy(() => SessionWhereInputSchema).optional(),
});

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
});

export const UserRoleOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserRoleOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  locationId: z.lazy(() => SortOrderSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
});

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional(),
});

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  idToken: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
});

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  idToken: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
});

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  accountId: z.lazy(() => SortOrderSchema).optional(),
  providerId: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  idToken: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
});

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
});

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
});

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
});

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
});

export const VerificationIdentifierValueCompoundUniqueInputSchema: z.ZodType<Prisma.VerificationIdentifierValueCompoundUniqueInput> = z.strictObject({
  identifier: z.string(),
  value: z.string(),
});

export const VerificationCountOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
});

export const VerificationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
});

export const VerificationMinOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
});

export const RoleCountOrderByAggregateInputSchema: z.ZodType<Prisma.RoleCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
});

export const RoleMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RoleMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
});

export const RoleMinOrderByAggregateInputSchema: z.ZodType<Prisma.RoleMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
});

export const RoleScalarRelationFilterSchema: z.ZodType<Prisma.RoleScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => RoleWhereInputSchema).optional(),
  isNot: z.lazy(() => RoleWhereInputSchema).optional(),
});

export const UserRoleCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserRoleCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const UserRoleMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserRoleMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const UserRoleMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserRoleMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  roleId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuListRelationFilterSchema: z.ZodType<Prisma.MenuListRelationFilter> = z.strictObject({
  every: z.lazy(() => MenuWhereInputSchema).optional(),
  some: z.lazy(() => MenuWhereInputSchema).optional(),
  none: z.lazy(() => MenuWhereInputSchema).optional(),
});

export const MenuOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MenuOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const CategoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CategoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CategoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CategoryScalarRelationFilterSchema: z.ZodType<Prisma.CategoryScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => CategoryWhereInputSchema).optional(),
  isNot: z.lazy(() => CategoryWhereInputSchema).optional(),
});

export const MenuSizeListRelationFilterSchema: z.ZodType<Prisma.MenuSizeListRelationFilter> = z.strictObject({
  every: z.lazy(() => MenuSizeWhereInputSchema).optional(),
  some: z.lazy(() => MenuSizeWhereInputSchema).optional(),
  none: z.lazy(() => MenuSizeWhereInputSchema).optional(),
});

export const MenuAddonListRelationFilterSchema: z.ZodType<Prisma.MenuAddonListRelationFilter> = z.strictObject({
  every: z.lazy(() => MenuAddonWhereInputSchema).optional(),
  some: z.lazy(() => MenuAddonWhereInputSchema).optional(),
  none: z.lazy(() => MenuAddonWhereInputSchema).optional(),
});

export const MenuSizeOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MenuSizeOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuAddonOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MenuAddonOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuCountOrderByAggregateInputSchema: z.ZodType<Prisma.MenuCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MenuMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuMinOrderByAggregateInputSchema: z.ZodType<Prisma.MenuMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
});

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const OrderItemListRelationFilterSchema: z.ZodType<Prisma.OrderItemListRelationFilter> = z.strictObject({
  every: z.lazy(() => OrderItemWhereInputSchema).optional(),
  some: z.lazy(() => OrderItemWhereInputSchema).optional(),
  none: z.lazy(() => OrderItemWhereInputSchema).optional(),
});

export const MenuScalarRelationFilterSchema: z.ZodType<Prisma.MenuScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => MenuWhereInputSchema).optional(),
  isNot: z.lazy(() => MenuWhereInputSchema).optional(),
});

export const OrderItemOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrderItemOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuSizeCountOrderByAggregateInputSchema: z.ZodType<Prisma.MenuSizeCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  isAvailable: z.lazy(() => SortOrderSchema).optional(),
  menuId: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuSizeAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MenuSizeAvgOrderByAggregateInput> = z.strictObject({
  price: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuSizeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MenuSizeMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  isAvailable: z.lazy(() => SortOrderSchema).optional(),
  menuId: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuSizeMinOrderByAggregateInputSchema: z.ZodType<Prisma.MenuSizeMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  isAvailable: z.lazy(() => SortOrderSchema).optional(),
  menuId: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuSizeSumOrderByAggregateInputSchema: z.ZodType<Prisma.MenuSizeSumOrderByAggregateInput> = z.strictObject({
  price: z.lazy(() => SortOrderSchema).optional(),
});

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const OrderItemAddonListRelationFilterSchema: z.ZodType<Prisma.OrderItemAddonListRelationFilter> = z.strictObject({
  every: z.lazy(() => OrderItemAddonWhereInputSchema).optional(),
  some: z.lazy(() => OrderItemAddonWhereInputSchema).optional(),
  none: z.lazy(() => OrderItemAddonWhereInputSchema).optional(),
});

export const OrderItemAddonOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrderItemAddonOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuAddonCountOrderByAggregateInputSchema: z.ZodType<Prisma.MenuAddonCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  isAvailable: z.lazy(() => SortOrderSchema).optional(),
  menuId: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuAddonAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MenuAddonAvgOrderByAggregateInput> = z.strictObject({
  price: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuAddonMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MenuAddonMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  isAvailable: z.lazy(() => SortOrderSchema).optional(),
  menuId: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuAddonMinOrderByAggregateInputSchema: z.ZodType<Prisma.MenuAddonMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  isAvailable: z.lazy(() => SortOrderSchema).optional(),
  menuId: z.lazy(() => SortOrderSchema).optional(),
});

export const MenuAddonSumOrderByAggregateInputSchema: z.ZodType<Prisma.MenuAddonSumOrderByAggregateInput> = z.strictObject({
  price: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrderCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  customerName: z.lazy(() => SortOrderSchema).optional(),
  paymentStatus: z.lazy(() => SortOrderSchema).optional(),
  orderStatus: z.lazy(() => SortOrderSchema).optional(),
  specialInstruction: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OrderAvgOrderByAggregateInput> = z.strictObject({
  total: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrderMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  customerName: z.lazy(() => SortOrderSchema).optional(),
  paymentStatus: z.lazy(() => SortOrderSchema).optional(),
  orderStatus: z.lazy(() => SortOrderSchema).optional(),
  specialInstruction: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrderMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  customerName: z.lazy(() => SortOrderSchema).optional(),
  paymentStatus: z.lazy(() => SortOrderSchema).optional(),
  orderStatus: z.lazy(() => SortOrderSchema).optional(),
  specialInstruction: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderSumOrderByAggregateInputSchema: z.ZodType<Prisma.OrderSumOrderByAggregateInput> = z.strictObject({
  total: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderScalarRelationFilterSchema: z.ZodType<Prisma.OrderScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => OrderWhereInputSchema).optional(),
  isNot: z.lazy(() => OrderWhereInputSchema).optional(),
});

export const MenuSizeScalarRelationFilterSchema: z.ZodType<Prisma.MenuSizeScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => MenuSizeWhereInputSchema).optional(),
  isNot: z.lazy(() => MenuSizeWhereInputSchema).optional(),
});

export const OrderItemCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  menuSizeId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderItemAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemAvgOrderByAggregateInput> = z.strictObject({
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderItemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  menuSizeId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderItemMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  menuSizeId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderItemSumOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemSumOrderByAggregateInput> = z.strictObject({
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderItemScalarRelationFilterSchema: z.ZodType<Prisma.OrderItemScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => OrderItemWhereInputSchema).optional(),
  isNot: z.lazy(() => OrderItemWhereInputSchema).optional(),
});

export const MenuAddonScalarRelationFilterSchema: z.ZodType<Prisma.MenuAddonScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => MenuAddonWhereInputSchema).optional(),
  isNot: z.lazy(() => MenuAddonWhereInputSchema).optional(),
});

export const OrderItemAddonCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemAddonCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  menuAddonId: z.lazy(() => SortOrderSchema).optional(),
  orderItemId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderItemAddonAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemAddonAvgOrderByAggregateInput> = z.strictObject({
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderItemAddonMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemAddonMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  menuAddonId: z.lazy(() => SortOrderSchema).optional(),
  orderItemId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderItemAddonMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemAddonMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  menuAddonId: z.lazy(() => SortOrderSchema).optional(),
  orderItemId: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderItemAddonSumOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemAddonSumOrderByAggregateInput> = z.strictObject({
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
});

export const UserRoleCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserRoleCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutUserInputSchema), z.lazy(() => UserRoleCreateWithoutUserInputSchema).array(), z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema), z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema), z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
});

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountCreateWithoutUserInputSchema).array(), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema), z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
});

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
});

export const UserRoleUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutUserInputSchema), z.lazy(() => UserRoleCreateWithoutUserInputSchema).array(), z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema), z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema), z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
});

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountCreateWithoutUserInputSchema).array(), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema), z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
});

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.strictObject({
  set: z.boolean().optional(),
});

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional().nullable(),
});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional(),
});

export const UserRoleUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserRoleUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutUserInputSchema), z.lazy(() => UserRoleCreateWithoutUserInputSchema).array(), z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema), z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema), z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserRoleUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => UserRoleUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserRoleScalarWhereInputSchema), z.lazy(() => UserRoleScalarWhereInputSchema).array() ]).optional(),
});

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountCreateWithoutUserInputSchema).array(), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema), z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema), z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
});

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
});

export const UserRoleUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutUserInputSchema), z.lazy(() => UserRoleCreateWithoutUserInputSchema).array(), z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema), z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema), z.lazy(() => UserRoleCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserRoleUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => UserRoleUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserRoleScalarWhereInputSchema), z.lazy(() => UserRoleScalarWhereInputSchema).array() ]).optional(),
});

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountCreateWithoutUserInputSchema).array(), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema), z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema), z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema), z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
});

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionCreateWithoutUserInputSchema).array(), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema), z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema), z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
});

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional().nullable(),
});

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema), z.lazy(() => UserUpdateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]).optional(),
});

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema), z.lazy(() => UserUpdateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]).optional(),
});

export const UserRoleCreateNestedManyWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleCreateNestedManyWithoutRoleInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutRoleInputSchema), z.lazy(() => UserRoleCreateWithoutRoleInputSchema).array(), z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema), z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema), z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyRoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
});

export const UserRoleUncheckedCreateNestedManyWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUncheckedCreateNestedManyWithoutRoleInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutRoleInputSchema), z.lazy(() => UserRoleCreateWithoutRoleInputSchema).array(), z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema), z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema), z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyRoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
});

export const UserRoleUpdateManyWithoutRoleNestedInputSchema: z.ZodType<Prisma.UserRoleUpdateManyWithoutRoleNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutRoleInputSchema), z.lazy(() => UserRoleCreateWithoutRoleInputSchema).array(), z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema), z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema), z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutRoleInputSchema), z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyRoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutRoleInputSchema), z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserRoleUpdateManyWithWhereWithoutRoleInputSchema), z.lazy(() => UserRoleUpdateManyWithWhereWithoutRoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserRoleScalarWhereInputSchema), z.lazy(() => UserRoleScalarWhereInputSchema).array() ]).optional(),
});

export const UserRoleUncheckedUpdateManyWithoutRoleNestedInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateManyWithoutRoleNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserRoleCreateWithoutRoleInputSchema), z.lazy(() => UserRoleCreateWithoutRoleInputSchema).array(), z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema), z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema), z.lazy(() => UserRoleCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutRoleInputSchema), z.lazy(() => UserRoleUpsertWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserRoleCreateManyRoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserRoleWhereUniqueInputSchema), z.lazy(() => UserRoleWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutRoleInputSchema), z.lazy(() => UserRoleUpdateWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserRoleUpdateManyWithWhereWithoutRoleInputSchema), z.lazy(() => UserRoleUpdateManyWithWhereWithoutRoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserRoleScalarWhereInputSchema), z.lazy(() => UserRoleScalarWhereInputSchema).array() ]).optional(),
});

export const UserCreateNestedOneWithoutUserRoleInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutUserRoleInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutUserRoleInputSchema), z.lazy(() => UserUncheckedCreateWithoutUserRoleInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUserRoleInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const RoleCreateNestedOneWithoutUserRoleInputSchema: z.ZodType<Prisma.RoleCreateNestedOneWithoutUserRoleInput> = z.strictObject({
  create: z.union([ z.lazy(() => RoleCreateWithoutUserRoleInputSchema), z.lazy(() => RoleUncheckedCreateWithoutUserRoleInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoleCreateOrConnectWithoutUserRoleInputSchema).optional(),
  connect: z.lazy(() => RoleWhereUniqueInputSchema).optional(),
});

export const UserUpdateOneRequiredWithoutUserRoleNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutUserRoleNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutUserRoleInputSchema), z.lazy(() => UserUncheckedCreateWithoutUserRoleInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUserRoleInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutUserRoleInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutUserRoleInputSchema), z.lazy(() => UserUpdateWithoutUserRoleInputSchema), z.lazy(() => UserUncheckedUpdateWithoutUserRoleInputSchema) ]).optional(),
});

export const RoleUpdateOneRequiredWithoutUserRoleNestedInputSchema: z.ZodType<Prisma.RoleUpdateOneRequiredWithoutUserRoleNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => RoleCreateWithoutUserRoleInputSchema), z.lazy(() => RoleUncheckedCreateWithoutUserRoleInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoleCreateOrConnectWithoutUserRoleInputSchema).optional(),
  upsert: z.lazy(() => RoleUpsertWithoutUserRoleInputSchema).optional(),
  connect: z.lazy(() => RoleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RoleUpdateToOneWithWhereWithoutUserRoleInputSchema), z.lazy(() => RoleUpdateWithoutUserRoleInputSchema), z.lazy(() => RoleUncheckedUpdateWithoutUserRoleInputSchema) ]).optional(),
});

export const MenuCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.MenuCreateNestedManyWithoutCategoryInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuCreateWithoutCategoryInputSchema), z.lazy(() => MenuCreateWithoutCategoryInputSchema).array(), z.lazy(() => MenuUncheckedCreateWithoutCategoryInputSchema), z.lazy(() => MenuUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MenuCreateOrConnectWithoutCategoryInputSchema), z.lazy(() => MenuCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MenuCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MenuWhereUniqueInputSchema), z.lazy(() => MenuWhereUniqueInputSchema).array() ]).optional(),
});

export const MenuUncheckedCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.MenuUncheckedCreateNestedManyWithoutCategoryInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuCreateWithoutCategoryInputSchema), z.lazy(() => MenuCreateWithoutCategoryInputSchema).array(), z.lazy(() => MenuUncheckedCreateWithoutCategoryInputSchema), z.lazy(() => MenuUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MenuCreateOrConnectWithoutCategoryInputSchema), z.lazy(() => MenuCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MenuCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MenuWhereUniqueInputSchema), z.lazy(() => MenuWhereUniqueInputSchema).array() ]).optional(),
});

export const MenuUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.MenuUpdateManyWithoutCategoryNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuCreateWithoutCategoryInputSchema), z.lazy(() => MenuCreateWithoutCategoryInputSchema).array(), z.lazy(() => MenuUncheckedCreateWithoutCategoryInputSchema), z.lazy(() => MenuUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MenuCreateOrConnectWithoutCategoryInputSchema), z.lazy(() => MenuCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MenuUpsertWithWhereUniqueWithoutCategoryInputSchema), z.lazy(() => MenuUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MenuCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MenuWhereUniqueInputSchema), z.lazy(() => MenuWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MenuWhereUniqueInputSchema), z.lazy(() => MenuWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MenuWhereUniqueInputSchema), z.lazy(() => MenuWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MenuWhereUniqueInputSchema), z.lazy(() => MenuWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MenuUpdateWithWhereUniqueWithoutCategoryInputSchema), z.lazy(() => MenuUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MenuUpdateManyWithWhereWithoutCategoryInputSchema), z.lazy(() => MenuUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MenuScalarWhereInputSchema), z.lazy(() => MenuScalarWhereInputSchema).array() ]).optional(),
});

export const MenuUncheckedUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.MenuUncheckedUpdateManyWithoutCategoryNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuCreateWithoutCategoryInputSchema), z.lazy(() => MenuCreateWithoutCategoryInputSchema).array(), z.lazy(() => MenuUncheckedCreateWithoutCategoryInputSchema), z.lazy(() => MenuUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MenuCreateOrConnectWithoutCategoryInputSchema), z.lazy(() => MenuCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MenuUpsertWithWhereUniqueWithoutCategoryInputSchema), z.lazy(() => MenuUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MenuCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MenuWhereUniqueInputSchema), z.lazy(() => MenuWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MenuWhereUniqueInputSchema), z.lazy(() => MenuWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MenuWhereUniqueInputSchema), z.lazy(() => MenuWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MenuWhereUniqueInputSchema), z.lazy(() => MenuWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MenuUpdateWithWhereUniqueWithoutCategoryInputSchema), z.lazy(() => MenuUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MenuUpdateManyWithWhereWithoutCategoryInputSchema), z.lazy(() => MenuUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MenuScalarWhereInputSchema), z.lazy(() => MenuScalarWhereInputSchema).array() ]).optional(),
});

export const CategoryCreateNestedOneWithoutMenuInputSchema: z.ZodType<Prisma.CategoryCreateNestedOneWithoutMenuInput> = z.strictObject({
  create: z.union([ z.lazy(() => CategoryCreateWithoutMenuInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutMenuInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutMenuInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
});

export const MenuSizeCreateNestedManyWithoutMenuInputSchema: z.ZodType<Prisma.MenuSizeCreateNestedManyWithoutMenuInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuSizeCreateWithoutMenuInputSchema), z.lazy(() => MenuSizeCreateWithoutMenuInputSchema).array(), z.lazy(() => MenuSizeUncheckedCreateWithoutMenuInputSchema), z.lazy(() => MenuSizeUncheckedCreateWithoutMenuInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MenuSizeCreateOrConnectWithoutMenuInputSchema), z.lazy(() => MenuSizeCreateOrConnectWithoutMenuInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MenuSizeCreateManyMenuInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MenuSizeWhereUniqueInputSchema), z.lazy(() => MenuSizeWhereUniqueInputSchema).array() ]).optional(),
});

export const MenuAddonCreateNestedManyWithoutMenuInputSchema: z.ZodType<Prisma.MenuAddonCreateNestedManyWithoutMenuInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuAddonCreateWithoutMenuInputSchema), z.lazy(() => MenuAddonCreateWithoutMenuInputSchema).array(), z.lazy(() => MenuAddonUncheckedCreateWithoutMenuInputSchema), z.lazy(() => MenuAddonUncheckedCreateWithoutMenuInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MenuAddonCreateOrConnectWithoutMenuInputSchema), z.lazy(() => MenuAddonCreateOrConnectWithoutMenuInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MenuAddonCreateManyMenuInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MenuAddonWhereUniqueInputSchema), z.lazy(() => MenuAddonWhereUniqueInputSchema).array() ]).optional(),
});

export const MenuSizeUncheckedCreateNestedManyWithoutMenuInputSchema: z.ZodType<Prisma.MenuSizeUncheckedCreateNestedManyWithoutMenuInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuSizeCreateWithoutMenuInputSchema), z.lazy(() => MenuSizeCreateWithoutMenuInputSchema).array(), z.lazy(() => MenuSizeUncheckedCreateWithoutMenuInputSchema), z.lazy(() => MenuSizeUncheckedCreateWithoutMenuInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MenuSizeCreateOrConnectWithoutMenuInputSchema), z.lazy(() => MenuSizeCreateOrConnectWithoutMenuInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MenuSizeCreateManyMenuInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MenuSizeWhereUniqueInputSchema), z.lazy(() => MenuSizeWhereUniqueInputSchema).array() ]).optional(),
});

export const MenuAddonUncheckedCreateNestedManyWithoutMenuInputSchema: z.ZodType<Prisma.MenuAddonUncheckedCreateNestedManyWithoutMenuInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuAddonCreateWithoutMenuInputSchema), z.lazy(() => MenuAddonCreateWithoutMenuInputSchema).array(), z.lazy(() => MenuAddonUncheckedCreateWithoutMenuInputSchema), z.lazy(() => MenuAddonUncheckedCreateWithoutMenuInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MenuAddonCreateOrConnectWithoutMenuInputSchema), z.lazy(() => MenuAddonCreateOrConnectWithoutMenuInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MenuAddonCreateManyMenuInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MenuAddonWhereUniqueInputSchema), z.lazy(() => MenuAddonWhereUniqueInputSchema).array() ]).optional(),
});

export const CategoryUpdateOneRequiredWithoutMenuNestedInputSchema: z.ZodType<Prisma.CategoryUpdateOneRequiredWithoutMenuNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CategoryCreateWithoutMenuInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutMenuInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutMenuInputSchema).optional(),
  upsert: z.lazy(() => CategoryUpsertWithoutMenuInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateToOneWithWhereWithoutMenuInputSchema), z.lazy(() => CategoryUpdateWithoutMenuInputSchema), z.lazy(() => CategoryUncheckedUpdateWithoutMenuInputSchema) ]).optional(),
});

export const MenuSizeUpdateManyWithoutMenuNestedInputSchema: z.ZodType<Prisma.MenuSizeUpdateManyWithoutMenuNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuSizeCreateWithoutMenuInputSchema), z.lazy(() => MenuSizeCreateWithoutMenuInputSchema).array(), z.lazy(() => MenuSizeUncheckedCreateWithoutMenuInputSchema), z.lazy(() => MenuSizeUncheckedCreateWithoutMenuInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MenuSizeCreateOrConnectWithoutMenuInputSchema), z.lazy(() => MenuSizeCreateOrConnectWithoutMenuInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MenuSizeUpsertWithWhereUniqueWithoutMenuInputSchema), z.lazy(() => MenuSizeUpsertWithWhereUniqueWithoutMenuInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MenuSizeCreateManyMenuInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MenuSizeWhereUniqueInputSchema), z.lazy(() => MenuSizeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MenuSizeWhereUniqueInputSchema), z.lazy(() => MenuSizeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MenuSizeWhereUniqueInputSchema), z.lazy(() => MenuSizeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MenuSizeWhereUniqueInputSchema), z.lazy(() => MenuSizeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MenuSizeUpdateWithWhereUniqueWithoutMenuInputSchema), z.lazy(() => MenuSizeUpdateWithWhereUniqueWithoutMenuInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MenuSizeUpdateManyWithWhereWithoutMenuInputSchema), z.lazy(() => MenuSizeUpdateManyWithWhereWithoutMenuInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MenuSizeScalarWhereInputSchema), z.lazy(() => MenuSizeScalarWhereInputSchema).array() ]).optional(),
});

export const MenuAddonUpdateManyWithoutMenuNestedInputSchema: z.ZodType<Prisma.MenuAddonUpdateManyWithoutMenuNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuAddonCreateWithoutMenuInputSchema), z.lazy(() => MenuAddonCreateWithoutMenuInputSchema).array(), z.lazy(() => MenuAddonUncheckedCreateWithoutMenuInputSchema), z.lazy(() => MenuAddonUncheckedCreateWithoutMenuInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MenuAddonCreateOrConnectWithoutMenuInputSchema), z.lazy(() => MenuAddonCreateOrConnectWithoutMenuInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MenuAddonUpsertWithWhereUniqueWithoutMenuInputSchema), z.lazy(() => MenuAddonUpsertWithWhereUniqueWithoutMenuInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MenuAddonCreateManyMenuInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MenuAddonWhereUniqueInputSchema), z.lazy(() => MenuAddonWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MenuAddonWhereUniqueInputSchema), z.lazy(() => MenuAddonWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MenuAddonWhereUniqueInputSchema), z.lazy(() => MenuAddonWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MenuAddonWhereUniqueInputSchema), z.lazy(() => MenuAddonWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MenuAddonUpdateWithWhereUniqueWithoutMenuInputSchema), z.lazy(() => MenuAddonUpdateWithWhereUniqueWithoutMenuInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MenuAddonUpdateManyWithWhereWithoutMenuInputSchema), z.lazy(() => MenuAddonUpdateManyWithWhereWithoutMenuInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MenuAddonScalarWhereInputSchema), z.lazy(() => MenuAddonScalarWhereInputSchema).array() ]).optional(),
});

export const MenuSizeUncheckedUpdateManyWithoutMenuNestedInputSchema: z.ZodType<Prisma.MenuSizeUncheckedUpdateManyWithoutMenuNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuSizeCreateWithoutMenuInputSchema), z.lazy(() => MenuSizeCreateWithoutMenuInputSchema).array(), z.lazy(() => MenuSizeUncheckedCreateWithoutMenuInputSchema), z.lazy(() => MenuSizeUncheckedCreateWithoutMenuInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MenuSizeCreateOrConnectWithoutMenuInputSchema), z.lazy(() => MenuSizeCreateOrConnectWithoutMenuInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MenuSizeUpsertWithWhereUniqueWithoutMenuInputSchema), z.lazy(() => MenuSizeUpsertWithWhereUniqueWithoutMenuInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MenuSizeCreateManyMenuInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MenuSizeWhereUniqueInputSchema), z.lazy(() => MenuSizeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MenuSizeWhereUniqueInputSchema), z.lazy(() => MenuSizeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MenuSizeWhereUniqueInputSchema), z.lazy(() => MenuSizeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MenuSizeWhereUniqueInputSchema), z.lazy(() => MenuSizeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MenuSizeUpdateWithWhereUniqueWithoutMenuInputSchema), z.lazy(() => MenuSizeUpdateWithWhereUniqueWithoutMenuInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MenuSizeUpdateManyWithWhereWithoutMenuInputSchema), z.lazy(() => MenuSizeUpdateManyWithWhereWithoutMenuInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MenuSizeScalarWhereInputSchema), z.lazy(() => MenuSizeScalarWhereInputSchema).array() ]).optional(),
});

export const MenuAddonUncheckedUpdateManyWithoutMenuNestedInputSchema: z.ZodType<Prisma.MenuAddonUncheckedUpdateManyWithoutMenuNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuAddonCreateWithoutMenuInputSchema), z.lazy(() => MenuAddonCreateWithoutMenuInputSchema).array(), z.lazy(() => MenuAddonUncheckedCreateWithoutMenuInputSchema), z.lazy(() => MenuAddonUncheckedCreateWithoutMenuInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MenuAddonCreateOrConnectWithoutMenuInputSchema), z.lazy(() => MenuAddonCreateOrConnectWithoutMenuInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MenuAddonUpsertWithWhereUniqueWithoutMenuInputSchema), z.lazy(() => MenuAddonUpsertWithWhereUniqueWithoutMenuInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MenuAddonCreateManyMenuInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MenuAddonWhereUniqueInputSchema), z.lazy(() => MenuAddonWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MenuAddonWhereUniqueInputSchema), z.lazy(() => MenuAddonWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MenuAddonWhereUniqueInputSchema), z.lazy(() => MenuAddonWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MenuAddonWhereUniqueInputSchema), z.lazy(() => MenuAddonWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MenuAddonUpdateWithWhereUniqueWithoutMenuInputSchema), z.lazy(() => MenuAddonUpdateWithWhereUniqueWithoutMenuInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MenuAddonUpdateManyWithWhereWithoutMenuInputSchema), z.lazy(() => MenuAddonUpdateManyWithWhereWithoutMenuInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MenuAddonScalarWhereInputSchema), z.lazy(() => MenuAddonScalarWhereInputSchema).array() ]).optional(),
});

export const OrderItemCreateNestedManyWithoutMenuSizeInputSchema: z.ZodType<Prisma.OrderItemCreateNestedManyWithoutMenuSizeInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutMenuSizeInputSchema), z.lazy(() => OrderItemCreateWithoutMenuSizeInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutMenuSizeInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutMenuSizeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutMenuSizeInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutMenuSizeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyMenuSizeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
});

export const MenuCreateNestedOneWithoutMenuSizesInputSchema: z.ZodType<Prisma.MenuCreateNestedOneWithoutMenuSizesInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuCreateWithoutMenuSizesInputSchema), z.lazy(() => MenuUncheckedCreateWithoutMenuSizesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MenuCreateOrConnectWithoutMenuSizesInputSchema).optional(),
  connect: z.lazy(() => MenuWhereUniqueInputSchema).optional(),
});

export const OrderItemUncheckedCreateNestedManyWithoutMenuSizeInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateNestedManyWithoutMenuSizeInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutMenuSizeInputSchema), z.lazy(() => OrderItemCreateWithoutMenuSizeInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutMenuSizeInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutMenuSizeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutMenuSizeInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutMenuSizeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyMenuSizeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
});

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const OrderItemUpdateManyWithoutMenuSizeNestedInputSchema: z.ZodType<Prisma.OrderItemUpdateManyWithoutMenuSizeNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutMenuSizeInputSchema), z.lazy(() => OrderItemCreateWithoutMenuSizeInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutMenuSizeInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutMenuSizeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutMenuSizeInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutMenuSizeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutMenuSizeInputSchema), z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutMenuSizeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyMenuSizeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutMenuSizeInputSchema), z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutMenuSizeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemUpdateManyWithWhereWithoutMenuSizeInputSchema), z.lazy(() => OrderItemUpdateManyWithWhereWithoutMenuSizeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema), z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
});

export const MenuUpdateOneRequiredWithoutMenuSizesNestedInputSchema: z.ZodType<Prisma.MenuUpdateOneRequiredWithoutMenuSizesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuCreateWithoutMenuSizesInputSchema), z.lazy(() => MenuUncheckedCreateWithoutMenuSizesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MenuCreateOrConnectWithoutMenuSizesInputSchema).optional(),
  upsert: z.lazy(() => MenuUpsertWithoutMenuSizesInputSchema).optional(),
  connect: z.lazy(() => MenuWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MenuUpdateToOneWithWhereWithoutMenuSizesInputSchema), z.lazy(() => MenuUpdateWithoutMenuSizesInputSchema), z.lazy(() => MenuUncheckedUpdateWithoutMenuSizesInputSchema) ]).optional(),
});

export const OrderItemUncheckedUpdateManyWithoutMenuSizeNestedInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyWithoutMenuSizeNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutMenuSizeInputSchema), z.lazy(() => OrderItemCreateWithoutMenuSizeInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutMenuSizeInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutMenuSizeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutMenuSizeInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutMenuSizeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutMenuSizeInputSchema), z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutMenuSizeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyMenuSizeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutMenuSizeInputSchema), z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutMenuSizeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemUpdateManyWithWhereWithoutMenuSizeInputSchema), z.lazy(() => OrderItemUpdateManyWithWhereWithoutMenuSizeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema), z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
});

export const OrderItemAddonCreateNestedManyWithoutMenuAddonInputSchema: z.ZodType<Prisma.OrderItemAddonCreateNestedManyWithoutMenuAddonInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemAddonCreateWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonCreateWithoutMenuAddonInputSchema).array(), z.lazy(() => OrderItemAddonUncheckedCreateWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonUncheckedCreateWithoutMenuAddonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemAddonCreateOrConnectWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonCreateOrConnectWithoutMenuAddonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemAddonCreateManyMenuAddonInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
});

export const MenuCreateNestedOneWithoutMenuAddonsInputSchema: z.ZodType<Prisma.MenuCreateNestedOneWithoutMenuAddonsInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuCreateWithoutMenuAddonsInputSchema), z.lazy(() => MenuUncheckedCreateWithoutMenuAddonsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MenuCreateOrConnectWithoutMenuAddonsInputSchema).optional(),
  connect: z.lazy(() => MenuWhereUniqueInputSchema).optional(),
});

export const OrderItemAddonUncheckedCreateNestedManyWithoutMenuAddonInputSchema: z.ZodType<Prisma.OrderItemAddonUncheckedCreateNestedManyWithoutMenuAddonInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemAddonCreateWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonCreateWithoutMenuAddonInputSchema).array(), z.lazy(() => OrderItemAddonUncheckedCreateWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonUncheckedCreateWithoutMenuAddonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemAddonCreateOrConnectWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonCreateOrConnectWithoutMenuAddonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemAddonCreateManyMenuAddonInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
});

export const OrderItemAddonUpdateManyWithoutMenuAddonNestedInputSchema: z.ZodType<Prisma.OrderItemAddonUpdateManyWithoutMenuAddonNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemAddonCreateWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonCreateWithoutMenuAddonInputSchema).array(), z.lazy(() => OrderItemAddonUncheckedCreateWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonUncheckedCreateWithoutMenuAddonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemAddonCreateOrConnectWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonCreateOrConnectWithoutMenuAddonInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemAddonUpsertWithWhereUniqueWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonUpsertWithWhereUniqueWithoutMenuAddonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemAddonCreateManyMenuAddonInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemAddonUpdateWithWhereUniqueWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonUpdateWithWhereUniqueWithoutMenuAddonInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemAddonUpdateManyWithWhereWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonUpdateManyWithWhereWithoutMenuAddonInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemAddonScalarWhereInputSchema), z.lazy(() => OrderItemAddonScalarWhereInputSchema).array() ]).optional(),
});

export const MenuUpdateOneRequiredWithoutMenuAddonsNestedInputSchema: z.ZodType<Prisma.MenuUpdateOneRequiredWithoutMenuAddonsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuCreateWithoutMenuAddonsInputSchema), z.lazy(() => MenuUncheckedCreateWithoutMenuAddonsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MenuCreateOrConnectWithoutMenuAddonsInputSchema).optional(),
  upsert: z.lazy(() => MenuUpsertWithoutMenuAddonsInputSchema).optional(),
  connect: z.lazy(() => MenuWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MenuUpdateToOneWithWhereWithoutMenuAddonsInputSchema), z.lazy(() => MenuUpdateWithoutMenuAddonsInputSchema), z.lazy(() => MenuUncheckedUpdateWithoutMenuAddonsInputSchema) ]).optional(),
});

export const OrderItemAddonUncheckedUpdateManyWithoutMenuAddonNestedInputSchema: z.ZodType<Prisma.OrderItemAddonUncheckedUpdateManyWithoutMenuAddonNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemAddonCreateWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonCreateWithoutMenuAddonInputSchema).array(), z.lazy(() => OrderItemAddonUncheckedCreateWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonUncheckedCreateWithoutMenuAddonInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemAddonCreateOrConnectWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonCreateOrConnectWithoutMenuAddonInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemAddonUpsertWithWhereUniqueWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonUpsertWithWhereUniqueWithoutMenuAddonInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemAddonCreateManyMenuAddonInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemAddonUpdateWithWhereUniqueWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonUpdateWithWhereUniqueWithoutMenuAddonInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemAddonUpdateManyWithWhereWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonUpdateManyWithWhereWithoutMenuAddonInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemAddonScalarWhereInputSchema), z.lazy(() => OrderItemAddonScalarWhereInputSchema).array() ]).optional(),
});

export const OrderItemCreateNestedManyWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemCreateNestedManyWithoutOrderInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema), z.lazy(() => OrderItemCreateWithoutOrderInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
});

export const OrderItemUncheckedCreateNestedManyWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema), z.lazy(() => OrderItemCreateWithoutOrderInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
});

export const OrderItemUpdateManyWithoutOrderNestedInputSchema: z.ZodType<Prisma.OrderItemUpdateManyWithoutOrderNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema), z.lazy(() => OrderItemCreateWithoutOrderInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema), z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema), z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderInputSchema), z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema), z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
});

export const OrderItemUncheckedUpdateManyWithoutOrderNestedInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyWithoutOrderNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema), z.lazy(() => OrderItemCreateWithoutOrderInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema), z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema), z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderInputSchema), z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema), z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
});

export const OrderItemAddonCreateNestedManyWithoutOrderItemInputSchema: z.ZodType<Prisma.OrderItemAddonCreateNestedManyWithoutOrderItemInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemAddonCreateWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonCreateWithoutOrderItemInputSchema).array(), z.lazy(() => OrderItemAddonUncheckedCreateWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonUncheckedCreateWithoutOrderItemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemAddonCreateOrConnectWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonCreateOrConnectWithoutOrderItemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemAddonCreateManyOrderItemInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
});

export const OrderCreateNestedOneWithoutItemsInputSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutItemsInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderCreateWithoutItemsInputSchema), z.lazy(() => OrderUncheckedCreateWithoutItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutItemsInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
});

export const MenuSizeCreateNestedOneWithoutOrderItemInputSchema: z.ZodType<Prisma.MenuSizeCreateNestedOneWithoutOrderItemInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuSizeCreateWithoutOrderItemInputSchema), z.lazy(() => MenuSizeUncheckedCreateWithoutOrderItemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MenuSizeCreateOrConnectWithoutOrderItemInputSchema).optional(),
  connect: z.lazy(() => MenuSizeWhereUniqueInputSchema).optional(),
});

export const OrderItemAddonUncheckedCreateNestedManyWithoutOrderItemInputSchema: z.ZodType<Prisma.OrderItemAddonUncheckedCreateNestedManyWithoutOrderItemInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemAddonCreateWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonCreateWithoutOrderItemInputSchema).array(), z.lazy(() => OrderItemAddonUncheckedCreateWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonUncheckedCreateWithoutOrderItemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemAddonCreateOrConnectWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonCreateOrConnectWithoutOrderItemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemAddonCreateManyOrderItemInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
});

export const OrderItemAddonUpdateManyWithoutOrderItemNestedInputSchema: z.ZodType<Prisma.OrderItemAddonUpdateManyWithoutOrderItemNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemAddonCreateWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonCreateWithoutOrderItemInputSchema).array(), z.lazy(() => OrderItemAddonUncheckedCreateWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonUncheckedCreateWithoutOrderItemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemAddonCreateOrConnectWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonCreateOrConnectWithoutOrderItemInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemAddonUpsertWithWhereUniqueWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonUpsertWithWhereUniqueWithoutOrderItemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemAddonCreateManyOrderItemInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemAddonUpdateWithWhereUniqueWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonUpdateWithWhereUniqueWithoutOrderItemInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemAddonUpdateManyWithWhereWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonUpdateManyWithWhereWithoutOrderItemInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemAddonScalarWhereInputSchema), z.lazy(() => OrderItemAddonScalarWhereInputSchema).array() ]).optional(),
});

export const OrderUpdateOneRequiredWithoutItemsNestedInputSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutItemsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderCreateWithoutItemsInputSchema), z.lazy(() => OrderUncheckedCreateWithoutItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutItemsInputSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutItemsInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrderUpdateToOneWithWhereWithoutItemsInputSchema), z.lazy(() => OrderUpdateWithoutItemsInputSchema), z.lazy(() => OrderUncheckedUpdateWithoutItemsInputSchema) ]).optional(),
});

export const MenuSizeUpdateOneRequiredWithoutOrderItemNestedInputSchema: z.ZodType<Prisma.MenuSizeUpdateOneRequiredWithoutOrderItemNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuSizeCreateWithoutOrderItemInputSchema), z.lazy(() => MenuSizeUncheckedCreateWithoutOrderItemInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MenuSizeCreateOrConnectWithoutOrderItemInputSchema).optional(),
  upsert: z.lazy(() => MenuSizeUpsertWithoutOrderItemInputSchema).optional(),
  connect: z.lazy(() => MenuSizeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MenuSizeUpdateToOneWithWhereWithoutOrderItemInputSchema), z.lazy(() => MenuSizeUpdateWithoutOrderItemInputSchema), z.lazy(() => MenuSizeUncheckedUpdateWithoutOrderItemInputSchema) ]).optional(),
});

export const OrderItemAddonUncheckedUpdateManyWithoutOrderItemNestedInputSchema: z.ZodType<Prisma.OrderItemAddonUncheckedUpdateManyWithoutOrderItemNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemAddonCreateWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonCreateWithoutOrderItemInputSchema).array(), z.lazy(() => OrderItemAddonUncheckedCreateWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonUncheckedCreateWithoutOrderItemInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemAddonCreateOrConnectWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonCreateOrConnectWithoutOrderItemInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemAddonUpsertWithWhereUniqueWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonUpsertWithWhereUniqueWithoutOrderItemInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemAddonCreateManyOrderItemInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemAddonWhereUniqueInputSchema), z.lazy(() => OrderItemAddonWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemAddonUpdateWithWhereUniqueWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonUpdateWithWhereUniqueWithoutOrderItemInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemAddonUpdateManyWithWhereWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonUpdateManyWithWhereWithoutOrderItemInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemAddonScalarWhereInputSchema), z.lazy(() => OrderItemAddonScalarWhereInputSchema).array() ]).optional(),
});

export const OrderItemCreateNestedOneWithoutItemAddonsInputSchema: z.ZodType<Prisma.OrderItemCreateNestedOneWithoutItemAddonsInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutItemAddonsInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutItemAddonsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderItemCreateOrConnectWithoutItemAddonsInputSchema).optional(),
  connect: z.lazy(() => OrderItemWhereUniqueInputSchema).optional(),
});

export const MenuAddonCreateNestedOneWithoutOrderItemAddonInputSchema: z.ZodType<Prisma.MenuAddonCreateNestedOneWithoutOrderItemAddonInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuAddonCreateWithoutOrderItemAddonInputSchema), z.lazy(() => MenuAddonUncheckedCreateWithoutOrderItemAddonInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MenuAddonCreateOrConnectWithoutOrderItemAddonInputSchema).optional(),
  connect: z.lazy(() => MenuAddonWhereUniqueInputSchema).optional(),
});

export const OrderItemUpdateOneRequiredWithoutItemAddonsNestedInputSchema: z.ZodType<Prisma.OrderItemUpdateOneRequiredWithoutItemAddonsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutItemAddonsInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutItemAddonsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderItemCreateOrConnectWithoutItemAddonsInputSchema).optional(),
  upsert: z.lazy(() => OrderItemUpsertWithoutItemAddonsInputSchema).optional(),
  connect: z.lazy(() => OrderItemWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrderItemUpdateToOneWithWhereWithoutItemAddonsInputSchema), z.lazy(() => OrderItemUpdateWithoutItemAddonsInputSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutItemAddonsInputSchema) ]).optional(),
});

export const MenuAddonUpdateOneRequiredWithoutOrderItemAddonNestedInputSchema: z.ZodType<Prisma.MenuAddonUpdateOneRequiredWithoutOrderItemAddonNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MenuAddonCreateWithoutOrderItemAddonInputSchema), z.lazy(() => MenuAddonUncheckedCreateWithoutOrderItemAddonInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => MenuAddonCreateOrConnectWithoutOrderItemAddonInputSchema).optional(),
  upsert: z.lazy(() => MenuAddonUpsertWithoutOrderItemAddonInputSchema).optional(),
  connect: z.lazy(() => MenuAddonWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => MenuAddonUpdateToOneWithWhereWithoutOrderItemAddonInputSchema), z.lazy(() => MenuAddonUpdateWithoutOrderItemAddonInputSchema), z.lazy(() => MenuAddonUncheckedUpdateWithoutOrderItemAddonInputSchema) ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
});

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
});

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const UserRoleCreateWithoutUserInputSchema: z.ZodType<Prisma.UserRoleCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  Role: z.lazy(() => RoleCreateNestedOneWithoutUserRoleInputSchema),
});

export const UserRoleUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  roleId: z.string(),
});

export const UserRoleCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.UserRoleCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => UserRoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserRoleCreateWithoutUserInputSchema), z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema) ]),
});

export const UserRoleCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.UserRoleCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => UserRoleCreateManyUserInputSchema), z.lazy(() => UserRoleCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  password: z.string().optional().nullable(),
});

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  password: z.string().optional().nullable(),
});

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
});

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => AccountCreateManyUserInputSchema), z.lazy(() => AccountCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  expiresAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
});

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  expiresAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
});

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
});

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => SessionCreateManyUserInputSchema), z.lazy(() => SessionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UserRoleUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => UserRoleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserRoleUpdateWithoutUserInputSchema), z.lazy(() => UserRoleUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => UserRoleCreateWithoutUserInputSchema), z.lazy(() => UserRoleUncheckedCreateWithoutUserInputSchema) ]),
});

export const UserRoleUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => UserRoleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserRoleUpdateWithoutUserInputSchema), z.lazy(() => UserRoleUncheckedUpdateWithoutUserInputSchema) ]),
});

export const UserRoleUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => UserRoleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserRoleUpdateManyMutationInputSchema), z.lazy(() => UserRoleUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const UserRoleScalarWhereInputSchema: z.ZodType<Prisma.UserRoleScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserRoleScalarWhereInputSchema), z.lazy(() => UserRoleScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserRoleScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserRoleScalarWhereInputSchema), z.lazy(() => UserRoleScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  roleId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema), z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema), z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
});

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema), z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
});

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateManyMutationInputSchema), z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => AccountScalarWhereInputSchema), z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereInputSchema), z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  accountId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  providerId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  accessToken: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  refreshToken: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  idToken: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  expiresAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
});

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema), z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema), z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
});

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema), z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
});

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => SessionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateManyMutationInputSchema), z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereInputSchema), z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
});

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  image: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  locationId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  image: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  locationId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
});

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
});

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.lazy(() => UserRoleUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.lazy(() => UserRoleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  image: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  locationId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  image: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  locationId: z.string().optional().nullable(),
  userRole: z.lazy(() => UserRoleUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
});

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
});

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.lazy(() => UserRoleUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userRole: z.lazy(() => UserRoleUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserRoleCreateWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleCreateWithoutRoleInput> = z.strictObject({
  id: z.uuid().optional(),
  User: z.lazy(() => UserCreateNestedOneWithoutUserRoleInputSchema),
});

export const UserRoleUncheckedCreateWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUncheckedCreateWithoutRoleInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
});

export const UserRoleCreateOrConnectWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleCreateOrConnectWithoutRoleInput> = z.strictObject({
  where: z.lazy(() => UserRoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserRoleCreateWithoutRoleInputSchema), z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema) ]),
});

export const UserRoleCreateManyRoleInputEnvelopeSchema: z.ZodType<Prisma.UserRoleCreateManyRoleInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => UserRoleCreateManyRoleInputSchema), z.lazy(() => UserRoleCreateManyRoleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UserRoleUpsertWithWhereUniqueWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUpsertWithWhereUniqueWithoutRoleInput> = z.strictObject({
  where: z.lazy(() => UserRoleWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserRoleUpdateWithoutRoleInputSchema), z.lazy(() => UserRoleUncheckedUpdateWithoutRoleInputSchema) ]),
  create: z.union([ z.lazy(() => UserRoleCreateWithoutRoleInputSchema), z.lazy(() => UserRoleUncheckedCreateWithoutRoleInputSchema) ]),
});

export const UserRoleUpdateWithWhereUniqueWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUpdateWithWhereUniqueWithoutRoleInput> = z.strictObject({
  where: z.lazy(() => UserRoleWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserRoleUpdateWithoutRoleInputSchema), z.lazy(() => UserRoleUncheckedUpdateWithoutRoleInputSchema) ]),
});

export const UserRoleUpdateManyWithWhereWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUpdateManyWithWhereWithoutRoleInput> = z.strictObject({
  where: z.lazy(() => UserRoleScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserRoleUpdateManyMutationInputSchema), z.lazy(() => UserRoleUncheckedUpdateManyWithoutRoleInputSchema) ]),
});

export const UserCreateWithoutUserRoleInputSchema: z.ZodType<Prisma.UserCreateWithoutUserRoleInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  image: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  locationId: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutUserRoleInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutUserRoleInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean().optional(),
  image: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  locationId: z.string().optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutUserRoleInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutUserRoleInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutUserRoleInputSchema), z.lazy(() => UserUncheckedCreateWithoutUserRoleInputSchema) ]),
});

export const RoleCreateWithoutUserRoleInputSchema: z.ZodType<Prisma.RoleCreateWithoutUserRoleInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
});

export const RoleUncheckedCreateWithoutUserRoleInputSchema: z.ZodType<Prisma.RoleUncheckedCreateWithoutUserRoleInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
});

export const RoleCreateOrConnectWithoutUserRoleInputSchema: z.ZodType<Prisma.RoleCreateOrConnectWithoutUserRoleInput> = z.strictObject({
  where: z.lazy(() => RoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoleCreateWithoutUserRoleInputSchema), z.lazy(() => RoleUncheckedCreateWithoutUserRoleInputSchema) ]),
});

export const UserUpsertWithoutUserRoleInputSchema: z.ZodType<Prisma.UserUpsertWithoutUserRoleInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutUserRoleInputSchema), z.lazy(() => UserUncheckedUpdateWithoutUserRoleInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutUserRoleInputSchema), z.lazy(() => UserUncheckedCreateWithoutUserRoleInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutUserRoleInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutUserRoleInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutUserRoleInputSchema), z.lazy(() => UserUncheckedUpdateWithoutUserRoleInputSchema) ]),
});

export const UserUpdateWithoutUserRoleInputSchema: z.ZodType<Prisma.UserUpdateWithoutUserRoleInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutUserRoleInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutUserRoleInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  locationId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const RoleUpsertWithoutUserRoleInputSchema: z.ZodType<Prisma.RoleUpsertWithoutUserRoleInput> = z.strictObject({
  update: z.union([ z.lazy(() => RoleUpdateWithoutUserRoleInputSchema), z.lazy(() => RoleUncheckedUpdateWithoutUserRoleInputSchema) ]),
  create: z.union([ z.lazy(() => RoleCreateWithoutUserRoleInputSchema), z.lazy(() => RoleUncheckedCreateWithoutUserRoleInputSchema) ]),
  where: z.lazy(() => RoleWhereInputSchema).optional(),
});

export const RoleUpdateToOneWithWhereWithoutUserRoleInputSchema: z.ZodType<Prisma.RoleUpdateToOneWithWhereWithoutUserRoleInput> = z.strictObject({
  where: z.lazy(() => RoleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RoleUpdateWithoutUserRoleInputSchema), z.lazy(() => RoleUncheckedUpdateWithoutUserRoleInputSchema) ]),
});

export const RoleUpdateWithoutUserRoleInputSchema: z.ZodType<Prisma.RoleUpdateWithoutUserRoleInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const RoleUncheckedUpdateWithoutUserRoleInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateWithoutUserRoleInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MenuCreateWithoutCategoryInputSchema: z.ZodType<Prisma.MenuCreateWithoutCategoryInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  menuSizes: z.lazy(() => MenuSizeCreateNestedManyWithoutMenuInputSchema).optional(),
  menuAddons: z.lazy(() => MenuAddonCreateNestedManyWithoutMenuInputSchema).optional(),
});

export const MenuUncheckedCreateWithoutCategoryInputSchema: z.ZodType<Prisma.MenuUncheckedCreateWithoutCategoryInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  menuSizes: z.lazy(() => MenuSizeUncheckedCreateNestedManyWithoutMenuInputSchema).optional(),
  menuAddons: z.lazy(() => MenuAddonUncheckedCreateNestedManyWithoutMenuInputSchema).optional(),
});

export const MenuCreateOrConnectWithoutCategoryInputSchema: z.ZodType<Prisma.MenuCreateOrConnectWithoutCategoryInput> = z.strictObject({
  where: z.lazy(() => MenuWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MenuCreateWithoutCategoryInputSchema), z.lazy(() => MenuUncheckedCreateWithoutCategoryInputSchema) ]),
});

export const MenuCreateManyCategoryInputEnvelopeSchema: z.ZodType<Prisma.MenuCreateManyCategoryInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => MenuCreateManyCategoryInputSchema), z.lazy(() => MenuCreateManyCategoryInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const MenuUpsertWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.MenuUpsertWithWhereUniqueWithoutCategoryInput> = z.strictObject({
  where: z.lazy(() => MenuWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MenuUpdateWithoutCategoryInputSchema), z.lazy(() => MenuUncheckedUpdateWithoutCategoryInputSchema) ]),
  create: z.union([ z.lazy(() => MenuCreateWithoutCategoryInputSchema), z.lazy(() => MenuUncheckedCreateWithoutCategoryInputSchema) ]),
});

export const MenuUpdateWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.MenuUpdateWithWhereUniqueWithoutCategoryInput> = z.strictObject({
  where: z.lazy(() => MenuWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MenuUpdateWithoutCategoryInputSchema), z.lazy(() => MenuUncheckedUpdateWithoutCategoryInputSchema) ]),
});

export const MenuUpdateManyWithWhereWithoutCategoryInputSchema: z.ZodType<Prisma.MenuUpdateManyWithWhereWithoutCategoryInput> = z.strictObject({
  where: z.lazy(() => MenuScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MenuUpdateManyMutationInputSchema), z.lazy(() => MenuUncheckedUpdateManyWithoutCategoryInputSchema) ]),
});

export const MenuScalarWhereInputSchema: z.ZodType<Prisma.MenuScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MenuScalarWhereInputSchema), z.lazy(() => MenuScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MenuScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MenuScalarWhereInputSchema), z.lazy(() => MenuScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const CategoryCreateWithoutMenuInputSchema: z.ZodType<Prisma.CategoryCreateWithoutMenuInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
});

export const CategoryUncheckedCreateWithoutMenuInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutMenuInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
});

export const CategoryCreateOrConnectWithoutMenuInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutMenuInput> = z.strictObject({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutMenuInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutMenuInputSchema) ]),
});

export const MenuSizeCreateWithoutMenuInputSchema: z.ZodType<Prisma.MenuSizeCreateWithoutMenuInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  OrderItem: z.lazy(() => OrderItemCreateNestedManyWithoutMenuSizeInputSchema).optional(),
});

export const MenuSizeUncheckedCreateWithoutMenuInputSchema: z.ZodType<Prisma.MenuSizeUncheckedCreateWithoutMenuInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  OrderItem: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutMenuSizeInputSchema).optional(),
});

export const MenuSizeCreateOrConnectWithoutMenuInputSchema: z.ZodType<Prisma.MenuSizeCreateOrConnectWithoutMenuInput> = z.strictObject({
  where: z.lazy(() => MenuSizeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MenuSizeCreateWithoutMenuInputSchema), z.lazy(() => MenuSizeUncheckedCreateWithoutMenuInputSchema) ]),
});

export const MenuSizeCreateManyMenuInputEnvelopeSchema: z.ZodType<Prisma.MenuSizeCreateManyMenuInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => MenuSizeCreateManyMenuInputSchema), z.lazy(() => MenuSizeCreateManyMenuInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const MenuAddonCreateWithoutMenuInputSchema: z.ZodType<Prisma.MenuAddonCreateWithoutMenuInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  OrderItemAddon: z.lazy(() => OrderItemAddonCreateNestedManyWithoutMenuAddonInputSchema).optional(),
});

export const MenuAddonUncheckedCreateWithoutMenuInputSchema: z.ZodType<Prisma.MenuAddonUncheckedCreateWithoutMenuInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  OrderItemAddon: z.lazy(() => OrderItemAddonUncheckedCreateNestedManyWithoutMenuAddonInputSchema).optional(),
});

export const MenuAddonCreateOrConnectWithoutMenuInputSchema: z.ZodType<Prisma.MenuAddonCreateOrConnectWithoutMenuInput> = z.strictObject({
  where: z.lazy(() => MenuAddonWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MenuAddonCreateWithoutMenuInputSchema), z.lazy(() => MenuAddonUncheckedCreateWithoutMenuInputSchema) ]),
});

export const MenuAddonCreateManyMenuInputEnvelopeSchema: z.ZodType<Prisma.MenuAddonCreateManyMenuInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => MenuAddonCreateManyMenuInputSchema), z.lazy(() => MenuAddonCreateManyMenuInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const CategoryUpsertWithoutMenuInputSchema: z.ZodType<Prisma.CategoryUpsertWithoutMenuInput> = z.strictObject({
  update: z.union([ z.lazy(() => CategoryUpdateWithoutMenuInputSchema), z.lazy(() => CategoryUncheckedUpdateWithoutMenuInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutMenuInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutMenuInputSchema) ]),
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
});

export const CategoryUpdateToOneWithWhereWithoutMenuInputSchema: z.ZodType<Prisma.CategoryUpdateToOneWithWhereWithoutMenuInput> = z.strictObject({
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutMenuInputSchema), z.lazy(() => CategoryUncheckedUpdateWithoutMenuInputSchema) ]),
});

export const CategoryUpdateWithoutMenuInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutMenuInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CategoryUncheckedUpdateWithoutMenuInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutMenuInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MenuSizeUpsertWithWhereUniqueWithoutMenuInputSchema: z.ZodType<Prisma.MenuSizeUpsertWithWhereUniqueWithoutMenuInput> = z.strictObject({
  where: z.lazy(() => MenuSizeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MenuSizeUpdateWithoutMenuInputSchema), z.lazy(() => MenuSizeUncheckedUpdateWithoutMenuInputSchema) ]),
  create: z.union([ z.lazy(() => MenuSizeCreateWithoutMenuInputSchema), z.lazy(() => MenuSizeUncheckedCreateWithoutMenuInputSchema) ]),
});

export const MenuSizeUpdateWithWhereUniqueWithoutMenuInputSchema: z.ZodType<Prisma.MenuSizeUpdateWithWhereUniqueWithoutMenuInput> = z.strictObject({
  where: z.lazy(() => MenuSizeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MenuSizeUpdateWithoutMenuInputSchema), z.lazy(() => MenuSizeUncheckedUpdateWithoutMenuInputSchema) ]),
});

export const MenuSizeUpdateManyWithWhereWithoutMenuInputSchema: z.ZodType<Prisma.MenuSizeUpdateManyWithWhereWithoutMenuInput> = z.strictObject({
  where: z.lazy(() => MenuSizeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MenuSizeUpdateManyMutationInputSchema), z.lazy(() => MenuSizeUncheckedUpdateManyWithoutMenuInputSchema) ]),
});

export const MenuSizeScalarWhereInputSchema: z.ZodType<Prisma.MenuSizeScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MenuSizeScalarWhereInputSchema), z.lazy(() => MenuSizeScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MenuSizeScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MenuSizeScalarWhereInputSchema), z.lazy(() => MenuSizeScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  isAvailable: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  menuId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const MenuAddonUpsertWithWhereUniqueWithoutMenuInputSchema: z.ZodType<Prisma.MenuAddonUpsertWithWhereUniqueWithoutMenuInput> = z.strictObject({
  where: z.lazy(() => MenuAddonWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MenuAddonUpdateWithoutMenuInputSchema), z.lazy(() => MenuAddonUncheckedUpdateWithoutMenuInputSchema) ]),
  create: z.union([ z.lazy(() => MenuAddonCreateWithoutMenuInputSchema), z.lazy(() => MenuAddonUncheckedCreateWithoutMenuInputSchema) ]),
});

export const MenuAddonUpdateWithWhereUniqueWithoutMenuInputSchema: z.ZodType<Prisma.MenuAddonUpdateWithWhereUniqueWithoutMenuInput> = z.strictObject({
  where: z.lazy(() => MenuAddonWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MenuAddonUpdateWithoutMenuInputSchema), z.lazy(() => MenuAddonUncheckedUpdateWithoutMenuInputSchema) ]),
});

export const MenuAddonUpdateManyWithWhereWithoutMenuInputSchema: z.ZodType<Prisma.MenuAddonUpdateManyWithWhereWithoutMenuInput> = z.strictObject({
  where: z.lazy(() => MenuAddonScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MenuAddonUpdateManyMutationInputSchema), z.lazy(() => MenuAddonUncheckedUpdateManyWithoutMenuInputSchema) ]),
});

export const MenuAddonScalarWhereInputSchema: z.ZodType<Prisma.MenuAddonScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MenuAddonScalarWhereInputSchema), z.lazy(() => MenuAddonScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MenuAddonScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MenuAddonScalarWhereInputSchema), z.lazy(() => MenuAddonScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  price: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  isAvailable: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  menuId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const OrderItemCreateWithoutMenuSizeInputSchema: z.ZodType<Prisma.OrderItemCreateWithoutMenuSizeInput> = z.strictObject({
  id: z.string().optional(),
  quantity: z.number(),
  total: z.number(),
  itemAddons: z.lazy(() => OrderItemAddonCreateNestedManyWithoutOrderItemInputSchema).optional(),
  Order: z.lazy(() => OrderCreateNestedOneWithoutItemsInputSchema),
});

export const OrderItemUncheckedCreateWithoutMenuSizeInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateWithoutMenuSizeInput> = z.strictObject({
  id: z.string().optional(),
  quantity: z.number(),
  total: z.number(),
  orderId: z.string(),
  itemAddons: z.lazy(() => OrderItemAddonUncheckedCreateNestedManyWithoutOrderItemInputSchema).optional(),
});

export const OrderItemCreateOrConnectWithoutMenuSizeInputSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutMenuSizeInput> = z.strictObject({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderItemCreateWithoutMenuSizeInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutMenuSizeInputSchema) ]),
});

export const OrderItemCreateManyMenuSizeInputEnvelopeSchema: z.ZodType<Prisma.OrderItemCreateManyMenuSizeInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => OrderItemCreateManyMenuSizeInputSchema), z.lazy(() => OrderItemCreateManyMenuSizeInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const MenuCreateWithoutMenuSizesInputSchema: z.ZodType<Prisma.MenuCreateWithoutMenuSizesInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  Category: z.lazy(() => CategoryCreateNestedOneWithoutMenuInputSchema),
  menuAddons: z.lazy(() => MenuAddonCreateNestedManyWithoutMenuInputSchema).optional(),
});

export const MenuUncheckedCreateWithoutMenuSizesInputSchema: z.ZodType<Prisma.MenuUncheckedCreateWithoutMenuSizesInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  categoryId: z.string(),
  menuAddons: z.lazy(() => MenuAddonUncheckedCreateNestedManyWithoutMenuInputSchema).optional(),
});

export const MenuCreateOrConnectWithoutMenuSizesInputSchema: z.ZodType<Prisma.MenuCreateOrConnectWithoutMenuSizesInput> = z.strictObject({
  where: z.lazy(() => MenuWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MenuCreateWithoutMenuSizesInputSchema), z.lazy(() => MenuUncheckedCreateWithoutMenuSizesInputSchema) ]),
});

export const OrderItemUpsertWithWhereUniqueWithoutMenuSizeInputSchema: z.ZodType<Prisma.OrderItemUpsertWithWhereUniqueWithoutMenuSizeInput> = z.strictObject({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderItemUpdateWithoutMenuSizeInputSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutMenuSizeInputSchema) ]),
  create: z.union([ z.lazy(() => OrderItemCreateWithoutMenuSizeInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutMenuSizeInputSchema) ]),
});

export const OrderItemUpdateWithWhereUniqueWithoutMenuSizeInputSchema: z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutMenuSizeInput> = z.strictObject({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderItemUpdateWithoutMenuSizeInputSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutMenuSizeInputSchema) ]),
});

export const OrderItemUpdateManyWithWhereWithoutMenuSizeInputSchema: z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutMenuSizeInput> = z.strictObject({
  where: z.lazy(() => OrderItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderItemUpdateManyMutationInputSchema), z.lazy(() => OrderItemUncheckedUpdateManyWithoutMenuSizeInputSchema) ]),
});

export const OrderItemScalarWhereInputSchema: z.ZodType<Prisma.OrderItemScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema), z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema), z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  menuSizeId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  total: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  orderId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const MenuUpsertWithoutMenuSizesInputSchema: z.ZodType<Prisma.MenuUpsertWithoutMenuSizesInput> = z.strictObject({
  update: z.union([ z.lazy(() => MenuUpdateWithoutMenuSizesInputSchema), z.lazy(() => MenuUncheckedUpdateWithoutMenuSizesInputSchema) ]),
  create: z.union([ z.lazy(() => MenuCreateWithoutMenuSizesInputSchema), z.lazy(() => MenuUncheckedCreateWithoutMenuSizesInputSchema) ]),
  where: z.lazy(() => MenuWhereInputSchema).optional(),
});

export const MenuUpdateToOneWithWhereWithoutMenuSizesInputSchema: z.ZodType<Prisma.MenuUpdateToOneWithWhereWithoutMenuSizesInput> = z.strictObject({
  where: z.lazy(() => MenuWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MenuUpdateWithoutMenuSizesInputSchema), z.lazy(() => MenuUncheckedUpdateWithoutMenuSizesInputSchema) ]),
});

export const MenuUpdateWithoutMenuSizesInputSchema: z.ZodType<Prisma.MenuUpdateWithoutMenuSizesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Category: z.lazy(() => CategoryUpdateOneRequiredWithoutMenuNestedInputSchema).optional(),
  menuAddons: z.lazy(() => MenuAddonUpdateManyWithoutMenuNestedInputSchema).optional(),
});

export const MenuUncheckedUpdateWithoutMenuSizesInputSchema: z.ZodType<Prisma.MenuUncheckedUpdateWithoutMenuSizesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  menuAddons: z.lazy(() => MenuAddonUncheckedUpdateManyWithoutMenuNestedInputSchema).optional(),
});

export const OrderItemAddonCreateWithoutMenuAddonInputSchema: z.ZodType<Prisma.OrderItemAddonCreateWithoutMenuAddonInput> = z.strictObject({
  id: z.uuid().optional(),
  quantity: z.number(),
  total: z.number(),
  OrderItem: z.lazy(() => OrderItemCreateNestedOneWithoutItemAddonsInputSchema),
});

export const OrderItemAddonUncheckedCreateWithoutMenuAddonInputSchema: z.ZodType<Prisma.OrderItemAddonUncheckedCreateWithoutMenuAddonInput> = z.strictObject({
  id: z.uuid().optional(),
  orderItemId: z.string(),
  quantity: z.number(),
  total: z.number(),
});

export const OrderItemAddonCreateOrConnectWithoutMenuAddonInputSchema: z.ZodType<Prisma.OrderItemAddonCreateOrConnectWithoutMenuAddonInput> = z.strictObject({
  where: z.lazy(() => OrderItemAddonWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderItemAddonCreateWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonUncheckedCreateWithoutMenuAddonInputSchema) ]),
});

export const OrderItemAddonCreateManyMenuAddonInputEnvelopeSchema: z.ZodType<Prisma.OrderItemAddonCreateManyMenuAddonInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => OrderItemAddonCreateManyMenuAddonInputSchema), z.lazy(() => OrderItemAddonCreateManyMenuAddonInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const MenuCreateWithoutMenuAddonsInputSchema: z.ZodType<Prisma.MenuCreateWithoutMenuAddonsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  Category: z.lazy(() => CategoryCreateNestedOneWithoutMenuInputSchema),
  menuSizes: z.lazy(() => MenuSizeCreateNestedManyWithoutMenuInputSchema).optional(),
});

export const MenuUncheckedCreateWithoutMenuAddonsInputSchema: z.ZodType<Prisma.MenuUncheckedCreateWithoutMenuAddonsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  categoryId: z.string(),
  menuSizes: z.lazy(() => MenuSizeUncheckedCreateNestedManyWithoutMenuInputSchema).optional(),
});

export const MenuCreateOrConnectWithoutMenuAddonsInputSchema: z.ZodType<Prisma.MenuCreateOrConnectWithoutMenuAddonsInput> = z.strictObject({
  where: z.lazy(() => MenuWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MenuCreateWithoutMenuAddonsInputSchema), z.lazy(() => MenuUncheckedCreateWithoutMenuAddonsInputSchema) ]),
});

export const OrderItemAddonUpsertWithWhereUniqueWithoutMenuAddonInputSchema: z.ZodType<Prisma.OrderItemAddonUpsertWithWhereUniqueWithoutMenuAddonInput> = z.strictObject({
  where: z.lazy(() => OrderItemAddonWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderItemAddonUpdateWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonUncheckedUpdateWithoutMenuAddonInputSchema) ]),
  create: z.union([ z.lazy(() => OrderItemAddonCreateWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonUncheckedCreateWithoutMenuAddonInputSchema) ]),
});

export const OrderItemAddonUpdateWithWhereUniqueWithoutMenuAddonInputSchema: z.ZodType<Prisma.OrderItemAddonUpdateWithWhereUniqueWithoutMenuAddonInput> = z.strictObject({
  where: z.lazy(() => OrderItemAddonWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderItemAddonUpdateWithoutMenuAddonInputSchema), z.lazy(() => OrderItemAddonUncheckedUpdateWithoutMenuAddonInputSchema) ]),
});

export const OrderItemAddonUpdateManyWithWhereWithoutMenuAddonInputSchema: z.ZodType<Prisma.OrderItemAddonUpdateManyWithWhereWithoutMenuAddonInput> = z.strictObject({
  where: z.lazy(() => OrderItemAddonScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderItemAddonUpdateManyMutationInputSchema), z.lazy(() => OrderItemAddonUncheckedUpdateManyWithoutMenuAddonInputSchema) ]),
});

export const OrderItemAddonScalarWhereInputSchema: z.ZodType<Prisma.OrderItemAddonScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrderItemAddonScalarWhereInputSchema), z.lazy(() => OrderItemAddonScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemAddonScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemAddonScalarWhereInputSchema), z.lazy(() => OrderItemAddonScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  menuAddonId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  orderItemId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  total: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
});

export const MenuUpsertWithoutMenuAddonsInputSchema: z.ZodType<Prisma.MenuUpsertWithoutMenuAddonsInput> = z.strictObject({
  update: z.union([ z.lazy(() => MenuUpdateWithoutMenuAddonsInputSchema), z.lazy(() => MenuUncheckedUpdateWithoutMenuAddonsInputSchema) ]),
  create: z.union([ z.lazy(() => MenuCreateWithoutMenuAddonsInputSchema), z.lazy(() => MenuUncheckedCreateWithoutMenuAddonsInputSchema) ]),
  where: z.lazy(() => MenuWhereInputSchema).optional(),
});

export const MenuUpdateToOneWithWhereWithoutMenuAddonsInputSchema: z.ZodType<Prisma.MenuUpdateToOneWithWhereWithoutMenuAddonsInput> = z.strictObject({
  where: z.lazy(() => MenuWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MenuUpdateWithoutMenuAddonsInputSchema), z.lazy(() => MenuUncheckedUpdateWithoutMenuAddonsInputSchema) ]),
});

export const MenuUpdateWithoutMenuAddonsInputSchema: z.ZodType<Prisma.MenuUpdateWithoutMenuAddonsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Category: z.lazy(() => CategoryUpdateOneRequiredWithoutMenuNestedInputSchema).optional(),
  menuSizes: z.lazy(() => MenuSizeUpdateManyWithoutMenuNestedInputSchema).optional(),
});

export const MenuUncheckedUpdateWithoutMenuAddonsInputSchema: z.ZodType<Prisma.MenuUncheckedUpdateWithoutMenuAddonsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  menuSizes: z.lazy(() => MenuSizeUncheckedUpdateManyWithoutMenuNestedInputSchema).optional(),
});

export const OrderItemCreateWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemCreateWithoutOrderInput> = z.strictObject({
  id: z.string().optional(),
  quantity: z.number(),
  total: z.number(),
  itemAddons: z.lazy(() => OrderItemAddonCreateNestedManyWithoutOrderItemInputSchema).optional(),
  MenuSize: z.lazy(() => MenuSizeCreateNestedOneWithoutOrderItemInputSchema),
});

export const OrderItemUncheckedCreateWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateWithoutOrderInput> = z.strictObject({
  id: z.string().optional(),
  menuSizeId: z.string(),
  quantity: z.number(),
  total: z.number(),
  itemAddons: z.lazy(() => OrderItemAddonUncheckedCreateNestedManyWithoutOrderItemInputSchema).optional(),
});

export const OrderItemCreateOrConnectWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutOrderInput> = z.strictObject({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema) ]),
});

export const OrderItemCreateManyOrderInputEnvelopeSchema: z.ZodType<Prisma.OrderItemCreateManyOrderInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => OrderItemCreateManyOrderInputSchema), z.lazy(() => OrderItemCreateManyOrderInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUpsertWithWhereUniqueWithoutOrderInput> = z.strictObject({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderItemUpdateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutOrderInputSchema) ]),
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema) ]),
});

export const OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutOrderInput> = z.strictObject({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderItemUpdateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutOrderInputSchema) ]),
});

export const OrderItemUpdateManyWithWhereWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutOrderInput> = z.strictObject({
  where: z.lazy(() => OrderItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderItemUpdateManyMutationInputSchema), z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderInputSchema) ]),
});

export const OrderItemAddonCreateWithoutOrderItemInputSchema: z.ZodType<Prisma.OrderItemAddonCreateWithoutOrderItemInput> = z.strictObject({
  id: z.uuid().optional(),
  quantity: z.number(),
  total: z.number(),
  MenuAddon: z.lazy(() => MenuAddonCreateNestedOneWithoutOrderItemAddonInputSchema),
});

export const OrderItemAddonUncheckedCreateWithoutOrderItemInputSchema: z.ZodType<Prisma.OrderItemAddonUncheckedCreateWithoutOrderItemInput> = z.strictObject({
  id: z.uuid().optional(),
  menuAddonId: z.string(),
  quantity: z.number(),
  total: z.number(),
});

export const OrderItemAddonCreateOrConnectWithoutOrderItemInputSchema: z.ZodType<Prisma.OrderItemAddonCreateOrConnectWithoutOrderItemInput> = z.strictObject({
  where: z.lazy(() => OrderItemAddonWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderItemAddonCreateWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonUncheckedCreateWithoutOrderItemInputSchema) ]),
});

export const OrderItemAddonCreateManyOrderItemInputEnvelopeSchema: z.ZodType<Prisma.OrderItemAddonCreateManyOrderItemInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => OrderItemAddonCreateManyOrderItemInputSchema), z.lazy(() => OrderItemAddonCreateManyOrderItemInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const OrderCreateWithoutItemsInputSchema: z.ZodType<Prisma.OrderCreateWithoutItemsInput> = z.strictObject({
  id: z.uuid().optional(),
  total: z.number(),
  customerName: z.string(),
  paymentStatus: z.string(),
  orderStatus: z.string(),
  specialInstruction: z.string(),
});

export const OrderUncheckedCreateWithoutItemsInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutItemsInput> = z.strictObject({
  id: z.uuid().optional(),
  total: z.number(),
  customerName: z.string(),
  paymentStatus: z.string(),
  orderStatus: z.string(),
  specialInstruction: z.string(),
});

export const OrderCreateOrConnectWithoutItemsInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutItemsInput> = z.strictObject({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutItemsInputSchema), z.lazy(() => OrderUncheckedCreateWithoutItemsInputSchema) ]),
});

export const MenuSizeCreateWithoutOrderItemInputSchema: z.ZodType<Prisma.MenuSizeCreateWithoutOrderItemInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  Menu: z.lazy(() => MenuCreateNestedOneWithoutMenuSizesInputSchema),
});

export const MenuSizeUncheckedCreateWithoutOrderItemInputSchema: z.ZodType<Prisma.MenuSizeUncheckedCreateWithoutOrderItemInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  menuId: z.string(),
});

export const MenuSizeCreateOrConnectWithoutOrderItemInputSchema: z.ZodType<Prisma.MenuSizeCreateOrConnectWithoutOrderItemInput> = z.strictObject({
  where: z.lazy(() => MenuSizeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MenuSizeCreateWithoutOrderItemInputSchema), z.lazy(() => MenuSizeUncheckedCreateWithoutOrderItemInputSchema) ]),
});

export const OrderItemAddonUpsertWithWhereUniqueWithoutOrderItemInputSchema: z.ZodType<Prisma.OrderItemAddonUpsertWithWhereUniqueWithoutOrderItemInput> = z.strictObject({
  where: z.lazy(() => OrderItemAddonWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderItemAddonUpdateWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonUncheckedUpdateWithoutOrderItemInputSchema) ]),
  create: z.union([ z.lazy(() => OrderItemAddonCreateWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonUncheckedCreateWithoutOrderItemInputSchema) ]),
});

export const OrderItemAddonUpdateWithWhereUniqueWithoutOrderItemInputSchema: z.ZodType<Prisma.OrderItemAddonUpdateWithWhereUniqueWithoutOrderItemInput> = z.strictObject({
  where: z.lazy(() => OrderItemAddonWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderItemAddonUpdateWithoutOrderItemInputSchema), z.lazy(() => OrderItemAddonUncheckedUpdateWithoutOrderItemInputSchema) ]),
});

export const OrderItemAddonUpdateManyWithWhereWithoutOrderItemInputSchema: z.ZodType<Prisma.OrderItemAddonUpdateManyWithWhereWithoutOrderItemInput> = z.strictObject({
  where: z.lazy(() => OrderItemAddonScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderItemAddonUpdateManyMutationInputSchema), z.lazy(() => OrderItemAddonUncheckedUpdateManyWithoutOrderItemInputSchema) ]),
});

export const OrderUpsertWithoutItemsInputSchema: z.ZodType<Prisma.OrderUpsertWithoutItemsInput> = z.strictObject({
  update: z.union([ z.lazy(() => OrderUpdateWithoutItemsInputSchema), z.lazy(() => OrderUncheckedUpdateWithoutItemsInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutItemsInputSchema), z.lazy(() => OrderUncheckedCreateWithoutItemsInputSchema) ]),
  where: z.lazy(() => OrderWhereInputSchema).optional(),
});

export const OrderUpdateToOneWithWhereWithoutItemsInputSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutItemsInput> = z.strictObject({
  where: z.lazy(() => OrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrderUpdateWithoutItemsInputSchema), z.lazy(() => OrderUncheckedUpdateWithoutItemsInputSchema) ]),
});

export const OrderUpdateWithoutItemsInputSchema: z.ZodType<Prisma.OrderUpdateWithoutItemsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentStatus: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderStatus: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  specialInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderUncheckedUpdateWithoutItemsInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutItemsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customerName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentStatus: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderStatus: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  specialInstruction: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MenuSizeUpsertWithoutOrderItemInputSchema: z.ZodType<Prisma.MenuSizeUpsertWithoutOrderItemInput> = z.strictObject({
  update: z.union([ z.lazy(() => MenuSizeUpdateWithoutOrderItemInputSchema), z.lazy(() => MenuSizeUncheckedUpdateWithoutOrderItemInputSchema) ]),
  create: z.union([ z.lazy(() => MenuSizeCreateWithoutOrderItemInputSchema), z.lazy(() => MenuSizeUncheckedCreateWithoutOrderItemInputSchema) ]),
  where: z.lazy(() => MenuSizeWhereInputSchema).optional(),
});

export const MenuSizeUpdateToOneWithWhereWithoutOrderItemInputSchema: z.ZodType<Prisma.MenuSizeUpdateToOneWithWhereWithoutOrderItemInput> = z.strictObject({
  where: z.lazy(() => MenuSizeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MenuSizeUpdateWithoutOrderItemInputSchema), z.lazy(() => MenuSizeUncheckedUpdateWithoutOrderItemInputSchema) ]),
});

export const MenuSizeUpdateWithoutOrderItemInputSchema: z.ZodType<Prisma.MenuSizeUpdateWithoutOrderItemInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Menu: z.lazy(() => MenuUpdateOneRequiredWithoutMenuSizesNestedInputSchema).optional(),
});

export const MenuSizeUncheckedUpdateWithoutOrderItemInputSchema: z.ZodType<Prisma.MenuSizeUncheckedUpdateWithoutOrderItemInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  menuId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemCreateWithoutItemAddonsInputSchema: z.ZodType<Prisma.OrderItemCreateWithoutItemAddonsInput> = z.strictObject({
  id: z.string().optional(),
  quantity: z.number(),
  total: z.number(),
  Order: z.lazy(() => OrderCreateNestedOneWithoutItemsInputSchema),
  MenuSize: z.lazy(() => MenuSizeCreateNestedOneWithoutOrderItemInputSchema),
});

export const OrderItemUncheckedCreateWithoutItemAddonsInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateWithoutItemAddonsInput> = z.strictObject({
  id: z.string().optional(),
  menuSizeId: z.string(),
  quantity: z.number(),
  total: z.number(),
  orderId: z.string(),
});

export const OrderItemCreateOrConnectWithoutItemAddonsInputSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutItemAddonsInput> = z.strictObject({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderItemCreateWithoutItemAddonsInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutItemAddonsInputSchema) ]),
});

export const MenuAddonCreateWithoutOrderItemAddonInputSchema: z.ZodType<Prisma.MenuAddonCreateWithoutOrderItemAddonInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  Menu: z.lazy(() => MenuCreateNestedOneWithoutMenuAddonsInputSchema),
});

export const MenuAddonUncheckedCreateWithoutOrderItemAddonInputSchema: z.ZodType<Prisma.MenuAddonUncheckedCreateWithoutOrderItemAddonInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
  menuId: z.string(),
});

export const MenuAddonCreateOrConnectWithoutOrderItemAddonInputSchema: z.ZodType<Prisma.MenuAddonCreateOrConnectWithoutOrderItemAddonInput> = z.strictObject({
  where: z.lazy(() => MenuAddonWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MenuAddonCreateWithoutOrderItemAddonInputSchema), z.lazy(() => MenuAddonUncheckedCreateWithoutOrderItemAddonInputSchema) ]),
});

export const OrderItemUpsertWithoutItemAddonsInputSchema: z.ZodType<Prisma.OrderItemUpsertWithoutItemAddonsInput> = z.strictObject({
  update: z.union([ z.lazy(() => OrderItemUpdateWithoutItemAddonsInputSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutItemAddonsInputSchema) ]),
  create: z.union([ z.lazy(() => OrderItemCreateWithoutItemAddonsInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutItemAddonsInputSchema) ]),
  where: z.lazy(() => OrderItemWhereInputSchema).optional(),
});

export const OrderItemUpdateToOneWithWhereWithoutItemAddonsInputSchema: z.ZodType<Prisma.OrderItemUpdateToOneWithWhereWithoutItemAddonsInput> = z.strictObject({
  where: z.lazy(() => OrderItemWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrderItemUpdateWithoutItemAddonsInputSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutItemAddonsInputSchema) ]),
});

export const OrderItemUpdateWithoutItemAddonsInputSchema: z.ZodType<Prisma.OrderItemUpdateWithoutItemAddonsInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  Order: z.lazy(() => OrderUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
  MenuSize: z.lazy(() => MenuSizeUpdateOneRequiredWithoutOrderItemNestedInputSchema).optional(),
});

export const OrderItemUncheckedUpdateWithoutItemAddonsInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateWithoutItemAddonsInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  menuSizeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MenuAddonUpsertWithoutOrderItemAddonInputSchema: z.ZodType<Prisma.MenuAddonUpsertWithoutOrderItemAddonInput> = z.strictObject({
  update: z.union([ z.lazy(() => MenuAddonUpdateWithoutOrderItemAddonInputSchema), z.lazy(() => MenuAddonUncheckedUpdateWithoutOrderItemAddonInputSchema) ]),
  create: z.union([ z.lazy(() => MenuAddonCreateWithoutOrderItemAddonInputSchema), z.lazy(() => MenuAddonUncheckedCreateWithoutOrderItemAddonInputSchema) ]),
  where: z.lazy(() => MenuAddonWhereInputSchema).optional(),
});

export const MenuAddonUpdateToOneWithWhereWithoutOrderItemAddonInputSchema: z.ZodType<Prisma.MenuAddonUpdateToOneWithWhereWithoutOrderItemAddonInput> = z.strictObject({
  where: z.lazy(() => MenuAddonWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => MenuAddonUpdateWithoutOrderItemAddonInputSchema), z.lazy(() => MenuAddonUncheckedUpdateWithoutOrderItemAddonInputSchema) ]),
});

export const MenuAddonUpdateWithoutOrderItemAddonInputSchema: z.ZodType<Prisma.MenuAddonUpdateWithoutOrderItemAddonInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Menu: z.lazy(() => MenuUpdateOneRequiredWithoutMenuAddonsNestedInputSchema).optional(),
});

export const MenuAddonUncheckedUpdateWithoutOrderItemAddonInputSchema: z.ZodType<Prisma.MenuAddonUncheckedUpdateWithoutOrderItemAddonInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  menuId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserRoleCreateManyUserInputSchema: z.ZodType<Prisma.UserRoleCreateManyUserInput> = z.strictObject({
  id: z.uuid().optional(),
  roleId: z.string(),
});

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> = z.strictObject({
  id: z.uuid().optional(),
  accountId: z.string(),
  providerId: z.string(),
  accessToken: z.string().optional().nullable(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  password: z.string().optional().nullable(),
});

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z.strictObject({
  id: z.uuid().optional(),
  expiresAt: z.coerce.date(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
});

export const UserRoleUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Role: z.lazy(() => RoleUpdateOneRequiredWithoutUserRoleNestedInputSchema).optional(),
});

export const UserRoleUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserRoleUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  roleId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  idToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const UserRoleCreateManyRoleInputSchema: z.ZodType<Prisma.UserRoleCreateManyRoleInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
});

export const UserRoleUpdateWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUpdateWithoutRoleInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUpdateOneRequiredWithoutUserRoleNestedInputSchema).optional(),
});

export const UserRoleUncheckedUpdateWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateWithoutRoleInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserRoleUncheckedUpdateManyWithoutRoleInputSchema: z.ZodType<Prisma.UserRoleUncheckedUpdateManyWithoutRoleInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MenuCreateManyCategoryInputSchema: z.ZodType<Prisma.MenuCreateManyCategoryInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
});

export const MenuUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.MenuUpdateWithoutCategoryInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  menuSizes: z.lazy(() => MenuSizeUpdateManyWithoutMenuNestedInputSchema).optional(),
  menuAddons: z.lazy(() => MenuAddonUpdateManyWithoutMenuNestedInputSchema).optional(),
});

export const MenuUncheckedUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.MenuUncheckedUpdateWithoutCategoryInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  menuSizes: z.lazy(() => MenuSizeUncheckedUpdateManyWithoutMenuNestedInputSchema).optional(),
  menuAddons: z.lazy(() => MenuAddonUncheckedUpdateManyWithoutMenuNestedInputSchema).optional(),
});

export const MenuUncheckedUpdateManyWithoutCategoryInputSchema: z.ZodType<Prisma.MenuUncheckedUpdateManyWithoutCategoryInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MenuSizeCreateManyMenuInputSchema: z.ZodType<Prisma.MenuSizeCreateManyMenuInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
});

export const MenuAddonCreateManyMenuInputSchema: z.ZodType<Prisma.MenuAddonCreateManyMenuInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  price: z.number(),
  isAvailable: z.boolean(),
});

export const MenuSizeUpdateWithoutMenuInputSchema: z.ZodType<Prisma.MenuSizeUpdateWithoutMenuInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  OrderItem: z.lazy(() => OrderItemUpdateManyWithoutMenuSizeNestedInputSchema).optional(),
});

export const MenuSizeUncheckedUpdateWithoutMenuInputSchema: z.ZodType<Prisma.MenuSizeUncheckedUpdateWithoutMenuInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  OrderItem: z.lazy(() => OrderItemUncheckedUpdateManyWithoutMenuSizeNestedInputSchema).optional(),
});

export const MenuSizeUncheckedUpdateManyWithoutMenuInputSchema: z.ZodType<Prisma.MenuSizeUncheckedUpdateManyWithoutMenuInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const MenuAddonUpdateWithoutMenuInputSchema: z.ZodType<Prisma.MenuAddonUpdateWithoutMenuInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  OrderItemAddon: z.lazy(() => OrderItemAddonUpdateManyWithoutMenuAddonNestedInputSchema).optional(),
});

export const MenuAddonUncheckedUpdateWithoutMenuInputSchema: z.ZodType<Prisma.MenuAddonUncheckedUpdateWithoutMenuInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  OrderItemAddon: z.lazy(() => OrderItemAddonUncheckedUpdateManyWithoutMenuAddonNestedInputSchema).optional(),
});

export const MenuAddonUncheckedUpdateManyWithoutMenuInputSchema: z.ZodType<Prisma.MenuAddonUncheckedUpdateManyWithoutMenuInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAvailable: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemCreateManyMenuSizeInputSchema: z.ZodType<Prisma.OrderItemCreateManyMenuSizeInput> = z.strictObject({
  id: z.string().optional(),
  quantity: z.number(),
  total: z.number(),
  orderId: z.string(),
});

export const OrderItemUpdateWithoutMenuSizeInputSchema: z.ZodType<Prisma.OrderItemUpdateWithoutMenuSizeInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  itemAddons: z.lazy(() => OrderItemAddonUpdateManyWithoutOrderItemNestedInputSchema).optional(),
  Order: z.lazy(() => OrderUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
});

export const OrderItemUncheckedUpdateWithoutMenuSizeInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateWithoutMenuSizeInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  itemAddons: z.lazy(() => OrderItemAddonUncheckedUpdateManyWithoutOrderItemNestedInputSchema).optional(),
});

export const OrderItemUncheckedUpdateManyWithoutMenuSizeInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyWithoutMenuSizeInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemAddonCreateManyMenuAddonInputSchema: z.ZodType<Prisma.OrderItemAddonCreateManyMenuAddonInput> = z.strictObject({
  id: z.uuid().optional(),
  orderItemId: z.string(),
  quantity: z.number(),
  total: z.number(),
});

export const OrderItemAddonUpdateWithoutMenuAddonInputSchema: z.ZodType<Prisma.OrderItemAddonUpdateWithoutMenuAddonInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  OrderItem: z.lazy(() => OrderItemUpdateOneRequiredWithoutItemAddonsNestedInputSchema).optional(),
});

export const OrderItemAddonUncheckedUpdateWithoutMenuAddonInputSchema: z.ZodType<Prisma.OrderItemAddonUncheckedUpdateWithoutMenuAddonInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemAddonUncheckedUpdateManyWithoutMenuAddonInputSchema: z.ZodType<Prisma.OrderItemAddonUncheckedUpdateManyWithoutMenuAddonInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  orderItemId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemCreateManyOrderInputSchema: z.ZodType<Prisma.OrderItemCreateManyOrderInput> = z.strictObject({
  id: z.string().optional(),
  menuSizeId: z.string(),
  quantity: z.number(),
  total: z.number(),
});

export const OrderItemUpdateWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUpdateWithoutOrderInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  itemAddons: z.lazy(() => OrderItemAddonUpdateManyWithoutOrderItemNestedInputSchema).optional(),
  MenuSize: z.lazy(() => MenuSizeUpdateOneRequiredWithoutOrderItemNestedInputSchema).optional(),
});

export const OrderItemUncheckedUpdateWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateWithoutOrderInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  menuSizeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  itemAddons: z.lazy(() => OrderItemAddonUncheckedUpdateManyWithoutOrderItemNestedInputSchema).optional(),
});

export const OrderItemUncheckedUpdateManyWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyWithoutOrderInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  menuSizeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemAddonCreateManyOrderItemInputSchema: z.ZodType<Prisma.OrderItemAddonCreateManyOrderItemInput> = z.strictObject({
  id: z.uuid().optional(),
  menuAddonId: z.string(),
  quantity: z.number(),
  total: z.number(),
});

export const OrderItemAddonUpdateWithoutOrderItemInputSchema: z.ZodType<Prisma.OrderItemAddonUpdateWithoutOrderItemInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  MenuAddon: z.lazy(() => MenuAddonUpdateOneRequiredWithoutOrderItemAddonNestedInputSchema).optional(),
});

export const OrderItemAddonUncheckedUpdateWithoutOrderItemInputSchema: z.ZodType<Prisma.OrderItemAddonUncheckedUpdateWithoutOrderItemInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  menuAddonId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemAddonUncheckedUpdateManyWithoutOrderItemInputSchema: z.ZodType<Prisma.OrderItemAddonUncheckedUpdateManyWithoutOrderItemInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  menuAddonId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(), 
  having: UserScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(), 
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(), 
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(), 
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z.object({
  where: AccountWhereInputSchema.optional(), 
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z.object({
  where: AccountWhereInputSchema.optional(), 
  orderBy: z.union([ AccountOrderByWithAggregationInputSchema.array(), AccountOrderByWithAggregationInputSchema ]).optional(),
  by: AccountScalarFieldEnumSchema.array(), 
  having: AccountScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema, 
}).strict();

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema, 
}).strict();

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z.object({
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z.object({
  where: SessionWhereInputSchema.optional(), 
  orderBy: z.union([ SessionOrderByWithAggregationInputSchema.array(), SessionOrderByWithAggregationInputSchema ]).optional(),
  by: SessionScalarFieldEnumSchema.array(), 
  having: SessionScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema, 
}).strict();

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema, 
}).strict();

export const VerificationFindFirstArgsSchema: z.ZodType<Prisma.VerificationFindFirstArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereInputSchema.optional(), 
  orderBy: z.union([ VerificationOrderByWithRelationInputSchema.array(), VerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationScalarFieldEnumSchema, VerificationScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VerificationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VerificationFindFirstOrThrowArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereInputSchema.optional(), 
  orderBy: z.union([ VerificationOrderByWithRelationInputSchema.array(), VerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationScalarFieldEnumSchema, VerificationScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VerificationFindManyArgsSchema: z.ZodType<Prisma.VerificationFindManyArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereInputSchema.optional(), 
  orderBy: z.union([ VerificationOrderByWithRelationInputSchema.array(), VerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationScalarFieldEnumSchema, VerificationScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VerificationAggregateArgsSchema: z.ZodType<Prisma.VerificationAggregateArgs> = z.object({
  where: VerificationWhereInputSchema.optional(), 
  orderBy: z.union([ VerificationOrderByWithRelationInputSchema.array(), VerificationOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const VerificationGroupByArgsSchema: z.ZodType<Prisma.VerificationGroupByArgs> = z.object({
  where: VerificationWhereInputSchema.optional(), 
  orderBy: z.union([ VerificationOrderByWithAggregationInputSchema.array(), VerificationOrderByWithAggregationInputSchema ]).optional(),
  by: VerificationScalarFieldEnumSchema.array(), 
  having: VerificationScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const VerificationFindUniqueArgsSchema: z.ZodType<Prisma.VerificationFindUniqueArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereUniqueInputSchema, 
}).strict();

export const VerificationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VerificationFindUniqueOrThrowArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereUniqueInputSchema, 
}).strict();

export const RoleFindFirstArgsSchema: z.ZodType<Prisma.RoleFindFirstArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereInputSchema.optional(), 
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(), RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoleScalarFieldEnumSchema, RoleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const RoleFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RoleFindFirstOrThrowArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereInputSchema.optional(), 
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(), RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoleScalarFieldEnumSchema, RoleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const RoleFindManyArgsSchema: z.ZodType<Prisma.RoleFindManyArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereInputSchema.optional(), 
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(), RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoleScalarFieldEnumSchema, RoleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const RoleAggregateArgsSchema: z.ZodType<Prisma.RoleAggregateArgs> = z.object({
  where: RoleWhereInputSchema.optional(), 
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(), RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const RoleGroupByArgsSchema: z.ZodType<Prisma.RoleGroupByArgs> = z.object({
  where: RoleWhereInputSchema.optional(), 
  orderBy: z.union([ RoleOrderByWithAggregationInputSchema.array(), RoleOrderByWithAggregationInputSchema ]).optional(),
  by: RoleScalarFieldEnumSchema.array(), 
  having: RoleScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const RoleFindUniqueArgsSchema: z.ZodType<Prisma.RoleFindUniqueArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema, 
}).strict();

export const RoleFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RoleFindUniqueOrThrowArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema, 
}).strict();

export const UserRoleFindFirstArgsSchema: z.ZodType<Prisma.UserRoleFindFirstArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  where: UserRoleWhereInputSchema.optional(), 
  orderBy: z.union([ UserRoleOrderByWithRelationInputSchema.array(), UserRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRoleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserRoleScalarFieldEnumSchema, UserRoleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserRoleFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserRoleFindFirstOrThrowArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  where: UserRoleWhereInputSchema.optional(), 
  orderBy: z.union([ UserRoleOrderByWithRelationInputSchema.array(), UserRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRoleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserRoleScalarFieldEnumSchema, UserRoleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserRoleFindManyArgsSchema: z.ZodType<Prisma.UserRoleFindManyArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  where: UserRoleWhereInputSchema.optional(), 
  orderBy: z.union([ UserRoleOrderByWithRelationInputSchema.array(), UserRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRoleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserRoleScalarFieldEnumSchema, UserRoleScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserRoleAggregateArgsSchema: z.ZodType<Prisma.UserRoleAggregateArgs> = z.object({
  where: UserRoleWhereInputSchema.optional(), 
  orderBy: z.union([ UserRoleOrderByWithRelationInputSchema.array(), UserRoleOrderByWithRelationInputSchema ]).optional(),
  cursor: UserRoleWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserRoleGroupByArgsSchema: z.ZodType<Prisma.UserRoleGroupByArgs> = z.object({
  where: UserRoleWhereInputSchema.optional(), 
  orderBy: z.union([ UserRoleOrderByWithAggregationInputSchema.array(), UserRoleOrderByWithAggregationInputSchema ]).optional(),
  by: UserRoleScalarFieldEnumSchema.array(), 
  having: UserRoleScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserRoleFindUniqueArgsSchema: z.ZodType<Prisma.UserRoleFindUniqueArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  where: UserRoleWhereUniqueInputSchema, 
}).strict();

export const UserRoleFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserRoleFindUniqueOrThrowArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  where: UserRoleWhereUniqueInputSchema, 
}).strict();

export const CategoryFindFirstArgsSchema: z.ZodType<Prisma.CategoryFindFirstArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(), CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema, CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CategoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindFirstOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(), CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema, CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CategoryFindManyArgsSchema: z.ZodType<Prisma.CategoryFindManyArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(), CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema, CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CategoryAggregateArgsSchema: z.ZodType<Prisma.CategoryAggregateArgs> = z.object({
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(), CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CategoryGroupByArgsSchema: z.ZodType<Prisma.CategoryGroupByArgs> = z.object({
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithAggregationInputSchema.array(), CategoryOrderByWithAggregationInputSchema ]).optional(),
  by: CategoryScalarFieldEnumSchema.array(), 
  having: CategoryScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CategoryFindUniqueArgsSchema: z.ZodType<Prisma.CategoryFindUniqueArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema, 
}).strict();

export const CategoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindUniqueOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema, 
}).strict();

export const MenuFindFirstArgsSchema: z.ZodType<Prisma.MenuFindFirstArgs> = z.object({
  select: MenuSelectSchema.optional(),
  include: MenuIncludeSchema.optional(),
  where: MenuWhereInputSchema.optional(), 
  orderBy: z.union([ MenuOrderByWithRelationInputSchema.array(), MenuOrderByWithRelationInputSchema ]).optional(),
  cursor: MenuWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MenuScalarFieldEnumSchema, MenuScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MenuFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MenuFindFirstOrThrowArgs> = z.object({
  select: MenuSelectSchema.optional(),
  include: MenuIncludeSchema.optional(),
  where: MenuWhereInputSchema.optional(), 
  orderBy: z.union([ MenuOrderByWithRelationInputSchema.array(), MenuOrderByWithRelationInputSchema ]).optional(),
  cursor: MenuWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MenuScalarFieldEnumSchema, MenuScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MenuFindManyArgsSchema: z.ZodType<Prisma.MenuFindManyArgs> = z.object({
  select: MenuSelectSchema.optional(),
  include: MenuIncludeSchema.optional(),
  where: MenuWhereInputSchema.optional(), 
  orderBy: z.union([ MenuOrderByWithRelationInputSchema.array(), MenuOrderByWithRelationInputSchema ]).optional(),
  cursor: MenuWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MenuScalarFieldEnumSchema, MenuScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MenuAggregateArgsSchema: z.ZodType<Prisma.MenuAggregateArgs> = z.object({
  where: MenuWhereInputSchema.optional(), 
  orderBy: z.union([ MenuOrderByWithRelationInputSchema.array(), MenuOrderByWithRelationInputSchema ]).optional(),
  cursor: MenuWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MenuGroupByArgsSchema: z.ZodType<Prisma.MenuGroupByArgs> = z.object({
  where: MenuWhereInputSchema.optional(), 
  orderBy: z.union([ MenuOrderByWithAggregationInputSchema.array(), MenuOrderByWithAggregationInputSchema ]).optional(),
  by: MenuScalarFieldEnumSchema.array(), 
  having: MenuScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MenuFindUniqueArgsSchema: z.ZodType<Prisma.MenuFindUniqueArgs> = z.object({
  select: MenuSelectSchema.optional(),
  include: MenuIncludeSchema.optional(),
  where: MenuWhereUniqueInputSchema, 
}).strict();

export const MenuFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MenuFindUniqueOrThrowArgs> = z.object({
  select: MenuSelectSchema.optional(),
  include: MenuIncludeSchema.optional(),
  where: MenuWhereUniqueInputSchema, 
}).strict();

export const MenuSizeFindFirstArgsSchema: z.ZodType<Prisma.MenuSizeFindFirstArgs> = z.object({
  select: MenuSizeSelectSchema.optional(),
  include: MenuSizeIncludeSchema.optional(),
  where: MenuSizeWhereInputSchema.optional(), 
  orderBy: z.union([ MenuSizeOrderByWithRelationInputSchema.array(), MenuSizeOrderByWithRelationInputSchema ]).optional(),
  cursor: MenuSizeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MenuSizeScalarFieldEnumSchema, MenuSizeScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MenuSizeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MenuSizeFindFirstOrThrowArgs> = z.object({
  select: MenuSizeSelectSchema.optional(),
  include: MenuSizeIncludeSchema.optional(),
  where: MenuSizeWhereInputSchema.optional(), 
  orderBy: z.union([ MenuSizeOrderByWithRelationInputSchema.array(), MenuSizeOrderByWithRelationInputSchema ]).optional(),
  cursor: MenuSizeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MenuSizeScalarFieldEnumSchema, MenuSizeScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MenuSizeFindManyArgsSchema: z.ZodType<Prisma.MenuSizeFindManyArgs> = z.object({
  select: MenuSizeSelectSchema.optional(),
  include: MenuSizeIncludeSchema.optional(),
  where: MenuSizeWhereInputSchema.optional(), 
  orderBy: z.union([ MenuSizeOrderByWithRelationInputSchema.array(), MenuSizeOrderByWithRelationInputSchema ]).optional(),
  cursor: MenuSizeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MenuSizeScalarFieldEnumSchema, MenuSizeScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MenuSizeAggregateArgsSchema: z.ZodType<Prisma.MenuSizeAggregateArgs> = z.object({
  where: MenuSizeWhereInputSchema.optional(), 
  orderBy: z.union([ MenuSizeOrderByWithRelationInputSchema.array(), MenuSizeOrderByWithRelationInputSchema ]).optional(),
  cursor: MenuSizeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MenuSizeGroupByArgsSchema: z.ZodType<Prisma.MenuSizeGroupByArgs> = z.object({
  where: MenuSizeWhereInputSchema.optional(), 
  orderBy: z.union([ MenuSizeOrderByWithAggregationInputSchema.array(), MenuSizeOrderByWithAggregationInputSchema ]).optional(),
  by: MenuSizeScalarFieldEnumSchema.array(), 
  having: MenuSizeScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MenuSizeFindUniqueArgsSchema: z.ZodType<Prisma.MenuSizeFindUniqueArgs> = z.object({
  select: MenuSizeSelectSchema.optional(),
  include: MenuSizeIncludeSchema.optional(),
  where: MenuSizeWhereUniqueInputSchema, 
}).strict();

export const MenuSizeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MenuSizeFindUniqueOrThrowArgs> = z.object({
  select: MenuSizeSelectSchema.optional(),
  include: MenuSizeIncludeSchema.optional(),
  where: MenuSizeWhereUniqueInputSchema, 
}).strict();

export const MenuAddonFindFirstArgsSchema: z.ZodType<Prisma.MenuAddonFindFirstArgs> = z.object({
  select: MenuAddonSelectSchema.optional(),
  include: MenuAddonIncludeSchema.optional(),
  where: MenuAddonWhereInputSchema.optional(), 
  orderBy: z.union([ MenuAddonOrderByWithRelationInputSchema.array(), MenuAddonOrderByWithRelationInputSchema ]).optional(),
  cursor: MenuAddonWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MenuAddonScalarFieldEnumSchema, MenuAddonScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MenuAddonFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MenuAddonFindFirstOrThrowArgs> = z.object({
  select: MenuAddonSelectSchema.optional(),
  include: MenuAddonIncludeSchema.optional(),
  where: MenuAddonWhereInputSchema.optional(), 
  orderBy: z.union([ MenuAddonOrderByWithRelationInputSchema.array(), MenuAddonOrderByWithRelationInputSchema ]).optional(),
  cursor: MenuAddonWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MenuAddonScalarFieldEnumSchema, MenuAddonScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MenuAddonFindManyArgsSchema: z.ZodType<Prisma.MenuAddonFindManyArgs> = z.object({
  select: MenuAddonSelectSchema.optional(),
  include: MenuAddonIncludeSchema.optional(),
  where: MenuAddonWhereInputSchema.optional(), 
  orderBy: z.union([ MenuAddonOrderByWithRelationInputSchema.array(), MenuAddonOrderByWithRelationInputSchema ]).optional(),
  cursor: MenuAddonWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MenuAddonScalarFieldEnumSchema, MenuAddonScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MenuAddonAggregateArgsSchema: z.ZodType<Prisma.MenuAddonAggregateArgs> = z.object({
  where: MenuAddonWhereInputSchema.optional(), 
  orderBy: z.union([ MenuAddonOrderByWithRelationInputSchema.array(), MenuAddonOrderByWithRelationInputSchema ]).optional(),
  cursor: MenuAddonWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MenuAddonGroupByArgsSchema: z.ZodType<Prisma.MenuAddonGroupByArgs> = z.object({
  where: MenuAddonWhereInputSchema.optional(), 
  orderBy: z.union([ MenuAddonOrderByWithAggregationInputSchema.array(), MenuAddonOrderByWithAggregationInputSchema ]).optional(),
  by: MenuAddonScalarFieldEnumSchema.array(), 
  having: MenuAddonScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MenuAddonFindUniqueArgsSchema: z.ZodType<Prisma.MenuAddonFindUniqueArgs> = z.object({
  select: MenuAddonSelectSchema.optional(),
  include: MenuAddonIncludeSchema.optional(),
  where: MenuAddonWhereUniqueInputSchema, 
}).strict();

export const MenuAddonFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MenuAddonFindUniqueOrThrowArgs> = z.object({
  select: MenuAddonSelectSchema.optional(),
  include: MenuAddonIncludeSchema.optional(),
  where: MenuAddonWhereUniqueInputSchema, 
}).strict();

export const OrderFindFirstArgsSchema: z.ZodType<Prisma.OrderFindFirstArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereInputSchema.optional(), 
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(), OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema, OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrderFindFirstOrThrowArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereInputSchema.optional(), 
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(), OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema, OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderFindManyArgsSchema: z.ZodType<Prisma.OrderFindManyArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereInputSchema.optional(), 
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(), OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema, OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderAggregateArgsSchema: z.ZodType<Prisma.OrderAggregateArgs> = z.object({
  where: OrderWhereInputSchema.optional(), 
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(), OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const OrderGroupByArgsSchema: z.ZodType<Prisma.OrderGroupByArgs> = z.object({
  where: OrderWhereInputSchema.optional(), 
  orderBy: z.union([ OrderOrderByWithAggregationInputSchema.array(), OrderOrderByWithAggregationInputSchema ]).optional(),
  by: OrderScalarFieldEnumSchema.array(), 
  having: OrderScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const OrderFindUniqueArgsSchema: z.ZodType<Prisma.OrderFindUniqueArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema, 
}).strict();

export const OrderFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrderFindUniqueOrThrowArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema, 
}).strict();

export const OrderItemFindFirstArgsSchema: z.ZodType<Prisma.OrderItemFindFirstArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  where: OrderItemWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemOrderByWithRelationInputSchema.array(), OrderItemOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderItemScalarFieldEnumSchema, OrderItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderItemFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrderItemFindFirstOrThrowArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  where: OrderItemWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemOrderByWithRelationInputSchema.array(), OrderItemOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderItemScalarFieldEnumSchema, OrderItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderItemFindManyArgsSchema: z.ZodType<Prisma.OrderItemFindManyArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  where: OrderItemWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemOrderByWithRelationInputSchema.array(), OrderItemOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderItemScalarFieldEnumSchema, OrderItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderItemAggregateArgsSchema: z.ZodType<Prisma.OrderItemAggregateArgs> = z.object({
  where: OrderItemWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemOrderByWithRelationInputSchema.array(), OrderItemOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const OrderItemGroupByArgsSchema: z.ZodType<Prisma.OrderItemGroupByArgs> = z.object({
  where: OrderItemWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemOrderByWithAggregationInputSchema.array(), OrderItemOrderByWithAggregationInputSchema ]).optional(),
  by: OrderItemScalarFieldEnumSchema.array(), 
  having: OrderItemScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const OrderItemFindUniqueArgsSchema: z.ZodType<Prisma.OrderItemFindUniqueArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  where: OrderItemWhereUniqueInputSchema, 
}).strict();

export const OrderItemFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrderItemFindUniqueOrThrowArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  where: OrderItemWhereUniqueInputSchema, 
}).strict();

export const OrderItemAddonFindFirstArgsSchema: z.ZodType<Prisma.OrderItemAddonFindFirstArgs> = z.object({
  select: OrderItemAddonSelectSchema.optional(),
  include: OrderItemAddonIncludeSchema.optional(),
  where: OrderItemAddonWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemAddonOrderByWithRelationInputSchema.array(), OrderItemAddonOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemAddonWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderItemAddonScalarFieldEnumSchema, OrderItemAddonScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderItemAddonFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrderItemAddonFindFirstOrThrowArgs> = z.object({
  select: OrderItemAddonSelectSchema.optional(),
  include: OrderItemAddonIncludeSchema.optional(),
  where: OrderItemAddonWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemAddonOrderByWithRelationInputSchema.array(), OrderItemAddonOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemAddonWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderItemAddonScalarFieldEnumSchema, OrderItemAddonScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderItemAddonFindManyArgsSchema: z.ZodType<Prisma.OrderItemAddonFindManyArgs> = z.object({
  select: OrderItemAddonSelectSchema.optional(),
  include: OrderItemAddonIncludeSchema.optional(),
  where: OrderItemAddonWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemAddonOrderByWithRelationInputSchema.array(), OrderItemAddonOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemAddonWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderItemAddonScalarFieldEnumSchema, OrderItemAddonScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderItemAddonAggregateArgsSchema: z.ZodType<Prisma.OrderItemAddonAggregateArgs> = z.object({
  where: OrderItemAddonWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemAddonOrderByWithRelationInputSchema.array(), OrderItemAddonOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemAddonWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const OrderItemAddonGroupByArgsSchema: z.ZodType<Prisma.OrderItemAddonGroupByArgs> = z.object({
  where: OrderItemAddonWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemAddonOrderByWithAggregationInputSchema.array(), OrderItemAddonOrderByWithAggregationInputSchema ]).optional(),
  by: OrderItemAddonScalarFieldEnumSchema.array(), 
  having: OrderItemAddonScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const OrderItemAddonFindUniqueArgsSchema: z.ZodType<Prisma.OrderItemAddonFindUniqueArgs> = z.object({
  select: OrderItemAddonSelectSchema.optional(),
  include: OrderItemAddonIncludeSchema.optional(),
  where: OrderItemAddonWhereUniqueInputSchema, 
}).strict();

export const OrderItemAddonFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrderItemAddonFindUniqueOrThrowArgs> = z.object({
  select: OrderItemAddonSelectSchema.optional(),
  include: OrderItemAddonIncludeSchema.optional(),
  where: OrderItemAddonWhereUniqueInputSchema, 
}).strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
  create: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountCreateInputSchema, AccountUncheckedCreateInputSchema ]),
}).strict();

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema, 
  create: z.union([ AccountCreateInputSchema, AccountUncheckedCreateInputSchema ]),
  update: z.union([ AccountUpdateInputSchema, AccountUncheckedUpdateInputSchema ]),
}).strict();

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema, AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AccountCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountCreateManyAndReturnArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema, AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema, 
}).strict();

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountUpdateInputSchema, AccountUncheckedUpdateInputSchema ]),
  where: AccountWhereUniqueInputSchema, 
}).strict();

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema, AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AccountUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema, AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z.object({
  where: AccountWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionCreateInputSchema, SessionUncheckedCreateInputSchema ]),
}).strict();

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema, 
  create: z.union([ SessionCreateInputSchema, SessionUncheckedCreateInputSchema ]),
  update: z.union([ SessionUpdateInputSchema, SessionUncheckedUpdateInputSchema ]),
}).strict();

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema, SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const SessionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionCreateManyAndReturnArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema, SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema, 
}).strict();

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionUpdateInputSchema, SessionUncheckedUpdateInputSchema ]),
  where: SessionWhereUniqueInputSchema, 
}).strict();

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema, SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const SessionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionUpdateManyAndReturnArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema, SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const VerificationCreateArgsSchema: z.ZodType<Prisma.VerificationCreateArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  data: z.union([ VerificationCreateInputSchema, VerificationUncheckedCreateInputSchema ]),
}).strict();

export const VerificationUpsertArgsSchema: z.ZodType<Prisma.VerificationUpsertArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereUniqueInputSchema, 
  create: z.union([ VerificationCreateInputSchema, VerificationUncheckedCreateInputSchema ]),
  update: z.union([ VerificationUpdateInputSchema, VerificationUncheckedUpdateInputSchema ]),
}).strict();

export const VerificationCreateManyArgsSchema: z.ZodType<Prisma.VerificationCreateManyArgs> = z.object({
  data: z.union([ VerificationCreateManyInputSchema, VerificationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const VerificationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationCreateManyAndReturnArgs> = z.object({
  data: z.union([ VerificationCreateManyInputSchema, VerificationCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const VerificationDeleteArgsSchema: z.ZodType<Prisma.VerificationDeleteArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  where: VerificationWhereUniqueInputSchema, 
}).strict();

export const VerificationUpdateArgsSchema: z.ZodType<Prisma.VerificationUpdateArgs> = z.object({
  select: VerificationSelectSchema.optional(),
  data: z.union([ VerificationUpdateInputSchema, VerificationUncheckedUpdateInputSchema ]),
  where: VerificationWhereUniqueInputSchema, 
}).strict();

export const VerificationUpdateManyArgsSchema: z.ZodType<Prisma.VerificationUpdateManyArgs> = z.object({
  data: z.union([ VerificationUpdateManyMutationInputSchema, VerificationUncheckedUpdateManyInputSchema ]),
  where: VerificationWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const VerificationUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationUpdateManyAndReturnArgs> = z.object({
  data: z.union([ VerificationUpdateManyMutationInputSchema, VerificationUncheckedUpdateManyInputSchema ]),
  where: VerificationWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const VerificationDeleteManyArgsSchema: z.ZodType<Prisma.VerificationDeleteManyArgs> = z.object({
  where: VerificationWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const RoleCreateArgsSchema: z.ZodType<Prisma.RoleCreateArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  data: z.union([ RoleCreateInputSchema, RoleUncheckedCreateInputSchema ]),
}).strict();

export const RoleUpsertArgsSchema: z.ZodType<Prisma.RoleUpsertArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema, 
  create: z.union([ RoleCreateInputSchema, RoleUncheckedCreateInputSchema ]),
  update: z.union([ RoleUpdateInputSchema, RoleUncheckedUpdateInputSchema ]),
}).strict();

export const RoleCreateManyArgsSchema: z.ZodType<Prisma.RoleCreateManyArgs> = z.object({
  data: z.union([ RoleCreateManyInputSchema, RoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const RoleCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RoleCreateManyAndReturnArgs> = z.object({
  data: z.union([ RoleCreateManyInputSchema, RoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const RoleDeleteArgsSchema: z.ZodType<Prisma.RoleDeleteArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema, 
}).strict();

export const RoleUpdateArgsSchema: z.ZodType<Prisma.RoleUpdateArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  data: z.union([ RoleUpdateInputSchema, RoleUncheckedUpdateInputSchema ]),
  where: RoleWhereUniqueInputSchema, 
}).strict();

export const RoleUpdateManyArgsSchema: z.ZodType<Prisma.RoleUpdateManyArgs> = z.object({
  data: z.union([ RoleUpdateManyMutationInputSchema, RoleUncheckedUpdateManyInputSchema ]),
  where: RoleWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const RoleUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.RoleUpdateManyAndReturnArgs> = z.object({
  data: z.union([ RoleUpdateManyMutationInputSchema, RoleUncheckedUpdateManyInputSchema ]),
  where: RoleWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const RoleDeleteManyArgsSchema: z.ZodType<Prisma.RoleDeleteManyArgs> = z.object({
  where: RoleWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserRoleCreateArgsSchema: z.ZodType<Prisma.UserRoleCreateArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  data: z.union([ UserRoleCreateInputSchema, UserRoleUncheckedCreateInputSchema ]),
}).strict();

export const UserRoleUpsertArgsSchema: z.ZodType<Prisma.UserRoleUpsertArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  where: UserRoleWhereUniqueInputSchema, 
  create: z.union([ UserRoleCreateInputSchema, UserRoleUncheckedCreateInputSchema ]),
  update: z.union([ UserRoleUpdateInputSchema, UserRoleUncheckedUpdateInputSchema ]),
}).strict();

export const UserRoleCreateManyArgsSchema: z.ZodType<Prisma.UserRoleCreateManyArgs> = z.object({
  data: z.union([ UserRoleCreateManyInputSchema, UserRoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserRoleCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserRoleCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserRoleCreateManyInputSchema, UserRoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserRoleDeleteArgsSchema: z.ZodType<Prisma.UserRoleDeleteArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  where: UserRoleWhereUniqueInputSchema, 
}).strict();

export const UserRoleUpdateArgsSchema: z.ZodType<Prisma.UserRoleUpdateArgs> = z.object({
  select: UserRoleSelectSchema.optional(),
  include: UserRoleIncludeSchema.optional(),
  data: z.union([ UserRoleUpdateInputSchema, UserRoleUncheckedUpdateInputSchema ]),
  where: UserRoleWhereUniqueInputSchema, 
}).strict();

export const UserRoleUpdateManyArgsSchema: z.ZodType<Prisma.UserRoleUpdateManyArgs> = z.object({
  data: z.union([ UserRoleUpdateManyMutationInputSchema, UserRoleUncheckedUpdateManyInputSchema ]),
  where: UserRoleWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserRoleUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserRoleUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserRoleUpdateManyMutationInputSchema, UserRoleUncheckedUpdateManyInputSchema ]),
  where: UserRoleWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserRoleDeleteManyArgsSchema: z.ZodType<Prisma.UserRoleDeleteManyArgs> = z.object({
  where: UserRoleWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CategoryCreateArgsSchema: z.ZodType<Prisma.CategoryCreateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryCreateInputSchema, CategoryUncheckedCreateInputSchema ]),
}).strict();

export const CategoryUpsertArgsSchema: z.ZodType<Prisma.CategoryUpsertArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema, 
  create: z.union([ CategoryCreateInputSchema, CategoryUncheckedCreateInputSchema ]),
  update: z.union([ CategoryUpdateInputSchema, CategoryUncheckedUpdateInputSchema ]),
}).strict();

export const CategoryCreateManyArgsSchema: z.ZodType<Prisma.CategoryCreateManyArgs> = z.object({
  data: z.union([ CategoryCreateManyInputSchema, CategoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CategoryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CategoryCreateManyAndReturnArgs> = z.object({
  data: z.union([ CategoryCreateManyInputSchema, CategoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CategoryDeleteArgsSchema: z.ZodType<Prisma.CategoryDeleteArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema, 
}).strict();

export const CategoryUpdateArgsSchema: z.ZodType<Prisma.CategoryUpdateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryUpdateInputSchema, CategoryUncheckedUpdateInputSchema ]),
  where: CategoryWhereUniqueInputSchema, 
}).strict();

export const CategoryUpdateManyArgsSchema: z.ZodType<Prisma.CategoryUpdateManyArgs> = z.object({
  data: z.union([ CategoryUpdateManyMutationInputSchema, CategoryUncheckedUpdateManyInputSchema ]),
  where: CategoryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CategoryUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CategoryUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CategoryUpdateManyMutationInputSchema, CategoryUncheckedUpdateManyInputSchema ]),
  where: CategoryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CategoryDeleteManyArgsSchema: z.ZodType<Prisma.CategoryDeleteManyArgs> = z.object({
  where: CategoryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MenuCreateArgsSchema: z.ZodType<Prisma.MenuCreateArgs> = z.object({
  select: MenuSelectSchema.optional(),
  include: MenuIncludeSchema.optional(),
  data: z.union([ MenuCreateInputSchema, MenuUncheckedCreateInputSchema ]),
}).strict();

export const MenuUpsertArgsSchema: z.ZodType<Prisma.MenuUpsertArgs> = z.object({
  select: MenuSelectSchema.optional(),
  include: MenuIncludeSchema.optional(),
  where: MenuWhereUniqueInputSchema, 
  create: z.union([ MenuCreateInputSchema, MenuUncheckedCreateInputSchema ]),
  update: z.union([ MenuUpdateInputSchema, MenuUncheckedUpdateInputSchema ]),
}).strict();

export const MenuCreateManyArgsSchema: z.ZodType<Prisma.MenuCreateManyArgs> = z.object({
  data: z.union([ MenuCreateManyInputSchema, MenuCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MenuCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MenuCreateManyAndReturnArgs> = z.object({
  data: z.union([ MenuCreateManyInputSchema, MenuCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MenuDeleteArgsSchema: z.ZodType<Prisma.MenuDeleteArgs> = z.object({
  select: MenuSelectSchema.optional(),
  include: MenuIncludeSchema.optional(),
  where: MenuWhereUniqueInputSchema, 
}).strict();

export const MenuUpdateArgsSchema: z.ZodType<Prisma.MenuUpdateArgs> = z.object({
  select: MenuSelectSchema.optional(),
  include: MenuIncludeSchema.optional(),
  data: z.union([ MenuUpdateInputSchema, MenuUncheckedUpdateInputSchema ]),
  where: MenuWhereUniqueInputSchema, 
}).strict();

export const MenuUpdateManyArgsSchema: z.ZodType<Prisma.MenuUpdateManyArgs> = z.object({
  data: z.union([ MenuUpdateManyMutationInputSchema, MenuUncheckedUpdateManyInputSchema ]),
  where: MenuWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MenuUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.MenuUpdateManyAndReturnArgs> = z.object({
  data: z.union([ MenuUpdateManyMutationInputSchema, MenuUncheckedUpdateManyInputSchema ]),
  where: MenuWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MenuDeleteManyArgsSchema: z.ZodType<Prisma.MenuDeleteManyArgs> = z.object({
  where: MenuWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MenuSizeCreateArgsSchema: z.ZodType<Prisma.MenuSizeCreateArgs> = z.object({
  select: MenuSizeSelectSchema.optional(),
  include: MenuSizeIncludeSchema.optional(),
  data: z.union([ MenuSizeCreateInputSchema, MenuSizeUncheckedCreateInputSchema ]),
}).strict();

export const MenuSizeUpsertArgsSchema: z.ZodType<Prisma.MenuSizeUpsertArgs> = z.object({
  select: MenuSizeSelectSchema.optional(),
  include: MenuSizeIncludeSchema.optional(),
  where: MenuSizeWhereUniqueInputSchema, 
  create: z.union([ MenuSizeCreateInputSchema, MenuSizeUncheckedCreateInputSchema ]),
  update: z.union([ MenuSizeUpdateInputSchema, MenuSizeUncheckedUpdateInputSchema ]),
}).strict();

export const MenuSizeCreateManyArgsSchema: z.ZodType<Prisma.MenuSizeCreateManyArgs> = z.object({
  data: z.union([ MenuSizeCreateManyInputSchema, MenuSizeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MenuSizeCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MenuSizeCreateManyAndReturnArgs> = z.object({
  data: z.union([ MenuSizeCreateManyInputSchema, MenuSizeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MenuSizeDeleteArgsSchema: z.ZodType<Prisma.MenuSizeDeleteArgs> = z.object({
  select: MenuSizeSelectSchema.optional(),
  include: MenuSizeIncludeSchema.optional(),
  where: MenuSizeWhereUniqueInputSchema, 
}).strict();

export const MenuSizeUpdateArgsSchema: z.ZodType<Prisma.MenuSizeUpdateArgs> = z.object({
  select: MenuSizeSelectSchema.optional(),
  include: MenuSizeIncludeSchema.optional(),
  data: z.union([ MenuSizeUpdateInputSchema, MenuSizeUncheckedUpdateInputSchema ]),
  where: MenuSizeWhereUniqueInputSchema, 
}).strict();

export const MenuSizeUpdateManyArgsSchema: z.ZodType<Prisma.MenuSizeUpdateManyArgs> = z.object({
  data: z.union([ MenuSizeUpdateManyMutationInputSchema, MenuSizeUncheckedUpdateManyInputSchema ]),
  where: MenuSizeWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MenuSizeUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.MenuSizeUpdateManyAndReturnArgs> = z.object({
  data: z.union([ MenuSizeUpdateManyMutationInputSchema, MenuSizeUncheckedUpdateManyInputSchema ]),
  where: MenuSizeWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MenuSizeDeleteManyArgsSchema: z.ZodType<Prisma.MenuSizeDeleteManyArgs> = z.object({
  where: MenuSizeWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MenuAddonCreateArgsSchema: z.ZodType<Prisma.MenuAddonCreateArgs> = z.object({
  select: MenuAddonSelectSchema.optional(),
  include: MenuAddonIncludeSchema.optional(),
  data: z.union([ MenuAddonCreateInputSchema, MenuAddonUncheckedCreateInputSchema ]),
}).strict();

export const MenuAddonUpsertArgsSchema: z.ZodType<Prisma.MenuAddonUpsertArgs> = z.object({
  select: MenuAddonSelectSchema.optional(),
  include: MenuAddonIncludeSchema.optional(),
  where: MenuAddonWhereUniqueInputSchema, 
  create: z.union([ MenuAddonCreateInputSchema, MenuAddonUncheckedCreateInputSchema ]),
  update: z.union([ MenuAddonUpdateInputSchema, MenuAddonUncheckedUpdateInputSchema ]),
}).strict();

export const MenuAddonCreateManyArgsSchema: z.ZodType<Prisma.MenuAddonCreateManyArgs> = z.object({
  data: z.union([ MenuAddonCreateManyInputSchema, MenuAddonCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MenuAddonCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MenuAddonCreateManyAndReturnArgs> = z.object({
  data: z.union([ MenuAddonCreateManyInputSchema, MenuAddonCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MenuAddonDeleteArgsSchema: z.ZodType<Prisma.MenuAddonDeleteArgs> = z.object({
  select: MenuAddonSelectSchema.optional(),
  include: MenuAddonIncludeSchema.optional(),
  where: MenuAddonWhereUniqueInputSchema, 
}).strict();

export const MenuAddonUpdateArgsSchema: z.ZodType<Prisma.MenuAddonUpdateArgs> = z.object({
  select: MenuAddonSelectSchema.optional(),
  include: MenuAddonIncludeSchema.optional(),
  data: z.union([ MenuAddonUpdateInputSchema, MenuAddonUncheckedUpdateInputSchema ]),
  where: MenuAddonWhereUniqueInputSchema, 
}).strict();

export const MenuAddonUpdateManyArgsSchema: z.ZodType<Prisma.MenuAddonUpdateManyArgs> = z.object({
  data: z.union([ MenuAddonUpdateManyMutationInputSchema, MenuAddonUncheckedUpdateManyInputSchema ]),
  where: MenuAddonWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MenuAddonUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.MenuAddonUpdateManyAndReturnArgs> = z.object({
  data: z.union([ MenuAddonUpdateManyMutationInputSchema, MenuAddonUncheckedUpdateManyInputSchema ]),
  where: MenuAddonWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MenuAddonDeleteManyArgsSchema: z.ZodType<Prisma.MenuAddonDeleteManyArgs> = z.object({
  where: MenuAddonWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderCreateArgsSchema: z.ZodType<Prisma.OrderCreateArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  data: z.union([ OrderCreateInputSchema, OrderUncheckedCreateInputSchema ]),
}).strict();

export const OrderUpsertArgsSchema: z.ZodType<Prisma.OrderUpsertArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema, 
  create: z.union([ OrderCreateInputSchema, OrderUncheckedCreateInputSchema ]),
  update: z.union([ OrderUpdateInputSchema, OrderUncheckedUpdateInputSchema ]),
}).strict();

export const OrderCreateManyArgsSchema: z.ZodType<Prisma.OrderCreateManyArgs> = z.object({
  data: z.union([ OrderCreateManyInputSchema, OrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const OrderCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrderCreateManyInputSchema, OrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const OrderDeleteArgsSchema: z.ZodType<Prisma.OrderDeleteArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema, 
}).strict();

export const OrderUpdateArgsSchema: z.ZodType<Prisma.OrderUpdateArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  data: z.union([ OrderUpdateInputSchema, OrderUncheckedUpdateInputSchema ]),
  where: OrderWhereUniqueInputSchema, 
}).strict();

export const OrderUpdateManyArgsSchema: z.ZodType<Prisma.OrderUpdateManyArgs> = z.object({
  data: z.union([ OrderUpdateManyMutationInputSchema, OrderUncheckedUpdateManyInputSchema ]),
  where: OrderWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderUpdateManyAndReturnArgs> = z.object({
  data: z.union([ OrderUpdateManyMutationInputSchema, OrderUncheckedUpdateManyInputSchema ]),
  where: OrderWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderDeleteManyArgsSchema: z.ZodType<Prisma.OrderDeleteManyArgs> = z.object({
  where: OrderWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderItemCreateArgsSchema: z.ZodType<Prisma.OrderItemCreateArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  data: z.union([ OrderItemCreateInputSchema, OrderItemUncheckedCreateInputSchema ]),
}).strict();

export const OrderItemUpsertArgsSchema: z.ZodType<Prisma.OrderItemUpsertArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  where: OrderItemWhereUniqueInputSchema, 
  create: z.union([ OrderItemCreateInputSchema, OrderItemUncheckedCreateInputSchema ]),
  update: z.union([ OrderItemUpdateInputSchema, OrderItemUncheckedUpdateInputSchema ]),
}).strict();

export const OrderItemCreateManyArgsSchema: z.ZodType<Prisma.OrderItemCreateManyArgs> = z.object({
  data: z.union([ OrderItemCreateManyInputSchema, OrderItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const OrderItemCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderItemCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrderItemCreateManyInputSchema, OrderItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const OrderItemDeleteArgsSchema: z.ZodType<Prisma.OrderItemDeleteArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  where: OrderItemWhereUniqueInputSchema, 
}).strict();

export const OrderItemUpdateArgsSchema: z.ZodType<Prisma.OrderItemUpdateArgs> = z.object({
  select: OrderItemSelectSchema.optional(),
  include: OrderItemIncludeSchema.optional(),
  data: z.union([ OrderItemUpdateInputSchema, OrderItemUncheckedUpdateInputSchema ]),
  where: OrderItemWhereUniqueInputSchema, 
}).strict();

export const OrderItemUpdateManyArgsSchema: z.ZodType<Prisma.OrderItemUpdateManyArgs> = z.object({
  data: z.union([ OrderItemUpdateManyMutationInputSchema, OrderItemUncheckedUpdateManyInputSchema ]),
  where: OrderItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderItemUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderItemUpdateManyAndReturnArgs> = z.object({
  data: z.union([ OrderItemUpdateManyMutationInputSchema, OrderItemUncheckedUpdateManyInputSchema ]),
  where: OrderItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderItemDeleteManyArgsSchema: z.ZodType<Prisma.OrderItemDeleteManyArgs> = z.object({
  where: OrderItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderItemAddonCreateArgsSchema: z.ZodType<Prisma.OrderItemAddonCreateArgs> = z.object({
  select: OrderItemAddonSelectSchema.optional(),
  include: OrderItemAddonIncludeSchema.optional(),
  data: z.union([ OrderItemAddonCreateInputSchema, OrderItemAddonUncheckedCreateInputSchema ]),
}).strict();

export const OrderItemAddonUpsertArgsSchema: z.ZodType<Prisma.OrderItemAddonUpsertArgs> = z.object({
  select: OrderItemAddonSelectSchema.optional(),
  include: OrderItemAddonIncludeSchema.optional(),
  where: OrderItemAddonWhereUniqueInputSchema, 
  create: z.union([ OrderItemAddonCreateInputSchema, OrderItemAddonUncheckedCreateInputSchema ]),
  update: z.union([ OrderItemAddonUpdateInputSchema, OrderItemAddonUncheckedUpdateInputSchema ]),
}).strict();

export const OrderItemAddonCreateManyArgsSchema: z.ZodType<Prisma.OrderItemAddonCreateManyArgs> = z.object({
  data: z.union([ OrderItemAddonCreateManyInputSchema, OrderItemAddonCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const OrderItemAddonCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderItemAddonCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrderItemAddonCreateManyInputSchema, OrderItemAddonCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const OrderItemAddonDeleteArgsSchema: z.ZodType<Prisma.OrderItemAddonDeleteArgs> = z.object({
  select: OrderItemAddonSelectSchema.optional(),
  include: OrderItemAddonIncludeSchema.optional(),
  where: OrderItemAddonWhereUniqueInputSchema, 
}).strict();

export const OrderItemAddonUpdateArgsSchema: z.ZodType<Prisma.OrderItemAddonUpdateArgs> = z.object({
  select: OrderItemAddonSelectSchema.optional(),
  include: OrderItemAddonIncludeSchema.optional(),
  data: z.union([ OrderItemAddonUpdateInputSchema, OrderItemAddonUncheckedUpdateInputSchema ]),
  where: OrderItemAddonWhereUniqueInputSchema, 
}).strict();

export const OrderItemAddonUpdateManyArgsSchema: z.ZodType<Prisma.OrderItemAddonUpdateManyArgs> = z.object({
  data: z.union([ OrderItemAddonUpdateManyMutationInputSchema, OrderItemAddonUncheckedUpdateManyInputSchema ]),
  where: OrderItemAddonWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderItemAddonUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderItemAddonUpdateManyAndReturnArgs> = z.object({
  data: z.union([ OrderItemAddonUpdateManyMutationInputSchema, OrderItemAddonUncheckedUpdateManyInputSchema ]),
  where: OrderItemAddonWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderItemAddonDeleteManyArgsSchema: z.ZodType<Prisma.OrderItemAddonDeleteManyArgs> = z.object({
  where: OrderItemAddonWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();