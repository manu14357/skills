---
name: shadcn-example-settings-page
description: >
  Reference example for the shadcn skill. Shows the complete expected workflow
  when a user asks to build a settings page — from project context check through
  component search, composition, form rules, and validation. Use as the benchmark
  for shadcn/ui output quality and rule enforcement.
---

# Example: User Settings Page

Demonstrates the full shadcn skill workflow on a common, rule-intensive request.
Settings pages touch nearly every critical rule: forms, composition, tabs, icons, and styling.

---

## User Request

> "Build a settings page with tabs for Profile, Account, and Notifications.
> Each tab has a form. Add a save button with a loading state."

---

## Step 0 — Get Project Context

```bash
npx shadcn@latest info --json
```

**Assumed output for this example:**

```json
{
  "aliases": { "components": "@/components", "utils": "@/lib/utils" },
  "isRSC": true,
  "tailwindVersion": "v4",
  "tailwindCssFile": "app/globals.css",
  "base": "radix",
  "iconLibrary": "lucide",
  "style": "nova",
  "framework": "next",
  "packageManager": "npm",
  "resolvedPaths": {
    "ui": "@/components/ui",
    "utils": "@/lib/utils"
  },
  "components": ["button", "card", "input", "label", "tabs", "separator"]
}
```

**Context decisions from this output:**

| Field | Decision |
|---|---|
| `isRSC: true` | This file needs `"use client"` — it uses `useState` for form and loading state |
| `base: radix` | Use `asChild` prop for custom triggers (not `render`) |
| `iconLibrary: lucide` | Import from `lucide-react` |
| `tailwindVersion: v4` | Theme overrides go in `app/globals.css` using `@theme inline` |
| `aliases` | Import as `@/components/ui/...` — never hardcode `../` paths |
| `components` | `button`, `card`, `input`, `label`, `tabs`, `separator` are already installed |

---

## Step 1 — Identify Missing Components

The page also needs: `Switch`, `Textarea`, `Badge`, `Skeleton`, `Separator` (already installed), `Avatar`.

Check if installed → `switch`, `textarea`, `badge`, `skeleton`, `avatar` are **not** in the components list.

```bash
# Get docs for components we're about to use
npx shadcn@latest docs tabs card input switch textarea avatar badge

# Preview before installing
npx shadcn@latest add switch textarea badge skeleton avatar --dry-run

# Install
npx shadcn@latest add switch textarea badge skeleton avatar
```

---

## Step 2 — Review Added Files

After install, read each added file and verify:
- Imports use the project's `aliases` — not hardcoded `@/components/ui`
- No violations of Critical Rules
- Icon imports use `lucide-react` (matches `iconLibrary`)

No issues found in this example — proceed.

---

## Step 3 — Build the Component

```tsx
"use client"
// ↑ Required because: useState, onChange handlers, browser interaction (isRSC: true)

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FieldGroup, Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { SaveIcon, BellIcon, UserIcon, ShieldIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1500)) // simulate async save
    setIsSaving(false)
  }

  return (
    <div className="flex flex-col gap-8 p-8 max-w-3xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        {/* ✅ TabsTrigger must be inside TabsList */}
        <TabsList>
          <TabsTrigger value="profile">
            <UserIcon data-icon="inline-start" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account">
            <ShieldIcon data-icon="inline-start" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <BellIcon data-icon="inline-start" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* ─── Profile Tab ──────────────────────────────────── */}
        <TabsContent value="profile">
          {/* ✅ Full Card composition */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your public profile information.</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
              {/* Avatar row */}
              <div className="flex items-center gap-4">
                {/* ✅ Avatar always needs AvatarFallback */}
                <Avatar className="size-16">
                  <AvatarImage src="/avatar.png" alt="Profile photo" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">Change photo</Button>
              </div>

              <Separator />

              {/* ✅ FieldGroup + Field — never raw div + Label */}
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="display-name">Display name</FieldLabel>
                  <Input id="display-name" placeholder="Jane Doe" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="bio">Bio</FieldLabel>
                  <Textarea id="bio" placeholder="Tell us a little about yourself." />
                  <FieldDescription>Maximum 160 characters.</FieldDescription>
                </Field>

                {/* ✅ Validation state: data-invalid on Field, aria-invalid on control */}
                <Field data-invalid>
                  <FieldLabel htmlFor="website">Website</FieldLabel>
                  <Input id="website" aria-invalid placeholder="https://example.com" />
                  <FieldDescription>Must be a valid URL.</FieldDescription>
                </Field>
              </FieldGroup>
            </CardContent>

            <CardFooter>
              {/* ✅ Button loading state: Spinner + data-icon + disabled */}
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon data-icon="inline-start" />
                    Save changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ─── Account Tab ──────────────────────────────────── */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your login credentials and account status.</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email address</FieldLabel>
                  <Input id="email" type="email" defaultValue="jane@example.com" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="current-password">Current password</FieldLabel>
                  <Input id="current-password" type="password" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="new-password">New password</FieldLabel>
                  <Input id="new-password" type="password" />
                </Field>
              </FieldGroup>

              <Separator />

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Account status</p>
                {/* ✅ Badge instead of custom styled span */}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Free plan</Badge>
                  <Badge>Verified</Badge>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <><Spinner data-icon="inline-start" />Saving...</>
                ) : (
                  <><SaveIcon data-icon="inline-start" />Update account</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ─── Notifications Tab ────────────────────────────── */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose what you want to be notified about.</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
              {[
                { id: "comments", label: "Comments", description: "When someone replies to your post." },
                { id: "mentions", label: "Mentions", description: "When someone @mentions you." },
                { id: "updates",  label: "Product updates", description: "New features and improvements." },
              ].map(({ id, label, description }) => (
                <div key={id} className="flex items-center justify-between gap-4">
                  {/* ✅ Field for label + description, Switch for control */}
                  <Field>
                    <FieldLabel htmlFor={id}>{label}</FieldLabel>
                    <FieldDescription>{description}</FieldDescription>
                  </Field>
                  <Switch id={id} />
                </div>
              ))}
            </CardContent>

            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <><Spinner data-icon="inline-start" />Saving...</>
                ) : (
                  <><SaveIcon data-icon="inline-start" />Save preferences</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

## Step 4 — Rule Audit

Run through every Critical Rule before delivering:

### Styling
- [x] No `space-y-*` — all vertical stacks use `flex flex-col gap-*`
- [x] `size-16` on Avatar — not `w-16 h-16`
- [x] No raw color values — all colors via semantic tokens (`text-muted-foreground`, etc.)
- [x] `cn()` available for conditional classes if needed
- [x] No manual `z-index`

### Forms
- [x] `FieldGroup` + `Field` wraps every form group
- [x] Validation uses `data-invalid` on `Field` + `aria-invalid` on `Input`
- [x] No raw `div` + `Label` combos

### Composition
- [x] `TabsTrigger` inside `TabsList`
- [x] `Avatar` has `AvatarFallback`
- [x] Full Card structure: `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`
- [x] No `isPending`/`isLoading` on Button — uses `Spinner` + `disabled`

### Icons
- [x] All icons use `data-icon="inline-start"` — no sizing classes
- [x] Icons imported from `lucide-react` (matches project `iconLibrary`)
- [x] Icons passed as JSX elements, not strings

### RSC / Client
- [x] `"use client"` at top — required because of `useState` and event handlers (`isRSC: true`)

---

## Common Mistakes This Example Avoids

| Mistake | What was done instead |
|---|---|
| `<div className="space-y-4">` for form layout | `<FieldGroup>` with `<Field>` children |
| `<Button isLoading>` | `<Button disabled><Spinner data-icon="inline-start" /></Button>` |
| `<SearchIcon className="size-4">` inside Button | `<SearchIcon data-icon="inline-start">` — no size class |
| `<span className="text-green-500">Verified</span>` | `<Badge>Verified</Badge>` |
| `<Avatar className="w-16 h-16">` | `<Avatar className="size-16">` |
| `<Avatar>` without fallback | `<AvatarFallback>JD</AvatarFallback>` always present |
| `<TabsTrigger>` outside `<TabsList>` | Correct nesting enforced |
| Hardcoded import path `../../components/ui/button` | Alias-based `@/components/ui/button` |