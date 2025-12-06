# Crop Farming Module Implementation Plan

## Goal Description
Implement a dedicated module for managing crop farming operations, specifically covering Field Management, Crop Cycles, and Harvest tracking. This aligns with the "Crop Farming Module" requirements from our research.

## Proposed Changes

### Data Layer
#### [MODIFY] [types.ts](file:///d:/Ecommatt-APP/types.ts)
-   **New Interfaces**:
    -   `Field`: id, name, size (ha/acres), soilType, location, status (Fallow, Planted).
    -   `Crop`: id, name, variety, varietyType (Maize, Beans, etc.), daysToMaturity.
    -   `CropCycle`: fieldId, cropId, plantingDate, expectedHarvestDate, status (Active, Harvested).
    -   `HarvestLog`: cycleId, date, quantity, quality, notes.

#### [MODIFY] [App.tsx](file:///d:/Ecommatt-APP/App.tsx)
-   Add state for `fields` (seeded with initial data).
-   Add state for `cropCycles`.
-   Add `ViewState.Crops` to routing.

### UI Components
#### [NEW] [components/CropManager.tsx](file:///d:/Ecommatt-APP/components/CropManager.tsx)
-   **Tabs/Views**:
    -   **Overview**: Summary of active fields, upcoming harvests.
    -   **Fields**: Card grid of fields showing current status (Green = Active, Brown = Fallow).
    -   **Harvests**: Log list and "Add Harvest" form.
-   **Features**:
    -   "Plant New Cycle" button on empty fields.
    -   Timeline visualizer for crop progress using `daysToMaturity`.

### Integration
-   **Navigation**: Add "Crops" icon (seedling/sprout) to Sidebar (`Layout.tsx`).

## Verification Plan
1.  **Field Creation**: Verify fields appear in the list.
2.  **Planting**: "Plant" a crop in a field, verify status changes to "Planted".
3.  **Harvesting**: Log a harvest, verify cycle closes or updates.
4.  **Navigation**: Ensure "Crops" view is accessible.
