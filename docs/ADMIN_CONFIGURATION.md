# Admin Configuration

## Admin Philosophy
The admin should control content and hierarchy without being able to damage the UI.

## Firm Management
Admin can:
- Add/edit the three subfirms.
- Upload logos.
- Set descriptions.
- Select approved brand/accent tokens.
- Set order.
- Activate/deactivate.

## Department Management
Admin can:
- Assign department to firm.
- Set name and definition.
- Upload/select circular logo.
- Choose approved accent.
- Choose card template.
- Set display order.
- Activate/deactivate.

Do not expose raw width, height, font, arbitrary colors, or custom CSS.

## Application Management
Admin can:
- Set application name.
- Description.
- URL.
- Icon.
- Firm.
- Department.
- Optional section.
- Tags and aliases.
- Launch mode.
- Fallback launch mode.
- Order.
- Active/maintenance state.

## Recommended Admin UI
Use drag-and-drop ordering for firms, departments, sections, and applications. Persist order automatically or with an explicit save action.

## Validation
- URL must be valid.
- Embedded mode should show a warning: destination may reject iframe embedding.
- Each department must have name and identity.
- Card templates should be validated against layout capacity.
- Inactive applications should never appear publicly.
