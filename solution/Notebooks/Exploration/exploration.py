import numpy as np

def normalization(reviews_df):
    letter_scores = {
        'A+': 10, 'A': 9, 'A-': 8.5, 'B+': 8, 'B': 7, 'B-': 6.5, 'C+': 6, 'C': 5, 'C-': 4.5, 'D+': 4, 'D': 3, 'D-': 2.5,
        'F': 1
    }

    #Initialize normalized_score column
    reviews_df['normalized_score'] = np.nan

    # --- FRACTION FORMAT ---
    mask_fraction = reviews_df['review_score'].str.contains('/', na=False)
    split_scores = reviews_df.loc[mask_fraction, 'review_score'].str.extract(r'(\d+(?:\.\d+)?)/(\d+(?:\.\d+)?)').astype(
        float)

    # Exclude zero denominators to avoid division by zero
    valid_denominator = split_scores[1] != 0
    valid_indices = split_scores[valid_denominator].index
    # Normalize valid fractions to a 0–10 scale
    normalized_values = (split_scores.loc[valid_denominator, 0] / split_scores.loc[valid_denominator, 1]) * 10
    reviews_df.loc[valid_indices, 'normalized_score'] = normalized_values
    # Create a mask for entries that contain 'x/0' or 'xx/00'
    mask_invalid_denominators = reviews_df['review_score'].str.contains(r'/0$', na=False)
    # Modify entries with invalid denominators
    reviews_df.loc[mask_invalid_denominators, 'review_score'] = reviews_df.loc[
        mask_invalid_denominators, 'review_score'].apply(
        lambda score: f"{float(score.split('/')[0]) / 10}/10" if '/' in score else score)

    # --- LETTER FORMAT ---
    mask_letter = ~mask_fraction & reviews_df['review_score'].str.contains(r'[A-F]', na=False)
    cleaned_letters = reviews_df.loc[mask_letter, 'review_score'].str.upper().str.replace(r'\s+', '', regex=True)
    reviews_df.loc[mask_letter, 'normalized_score'] = cleaned_letters.map(letter_scores)

    # --- RAW NUMERIC FORMAT ---
    mask_numeric = ~mask_fraction & reviews_df['review_score'].str.match(r'^\d+(\.\d+)?$', na=False)
    numeric_scores = reviews_df.loc[mask_numeric, 'review_score'].astype(float)
    # Heuristic: if the score is ≤10, treat as out of 10; else, treat as out of 100
    normalized_numeric = numeric_scores.apply(lambda x: x if x <= 10 else (x / 100) * 10)
    reviews_df.loc[mask_numeric, 'normalized_score'] = normalized_numeric

    # --- NOMINATOR AND DENOMINATOR ON DIFFERENT SCALES ---
    # Extract numerator and denominator as floats
    fraction_parts = reviews_df.loc[mask_fraction, 'review_score'].str.extract(
        r'(\d+(?:\.\d+)?)/(\d+(?:\.\d+)?)').astype(float)
    numerators = fraction_parts[0]
    denominators = fraction_parts[1]

    # Create a mask: numerator <= 10 AND denominator is 4 or 5
    fix_scale_mask = (numerators <= 10) & (denominators.isin([4.0, 5.0]))

    # Indexes where the fix applies
    fix_indices = numerators[fix_scale_mask].index

    # Replace original review_score strings at those indices with 'numerator/10'
    reviews_df.loc[fix_indices, 'review_score'] = numerators[fix_indices].astype(str) + '/10'

    reviews_df = reviews_df[reviews_df['normalized_score'].between(0, 10)]
    return reviews_df