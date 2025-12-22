/*
  # Remove id_fin column from members table

  1. Changes
    - Drop the `id_fin` column from the `members` table as it's no longer needed
    - This column was previously required but has been removed from the application

  2. Notes
    - This is a safe operation as the field has been removed from the form
    - Any existing data in this column will be permanently deleted
*/

-- Remove the id_fin column from the members table
ALTER TABLE members DROP COLUMN IF EXISTS id_fin;