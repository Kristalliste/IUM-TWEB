import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import squarify

# --- AnalysisReport ---
def language_movies_merge(languages_df, movies_df):
    languages_movies_df = pd.merge(
        movies_df[['id', 'name', 'date']],
        languages_df[['id', 'language']],
        on='id',
        how='inner')
    return languages_movies_df

def countries_movies_merge(countries_df, movies_df):
    countries_movies_df = pd.merge(
        movies_df[['id', 'name', 'date']],
        countries_df[['id', 'country']],
        on='id',
        how='inner')
    return countries_movies_df

def genres_movies_merge(genres_df, movies_df):
    genres_movies_df = pd.merge(
        movies_df[['id', 'name', 'date']],
        genres_df[['id', 'genre']],
        on='id',
        how='inner')
    return genres_movies_df

def countries_oscar_merge(countries_df, oscar_df):
    # Dropping the entries with null `film` values
    temp_oscar_df = oscar_df.dropna(subset=['film'], how='all')
    countries_wins_merged_df = pd.merge(
        countries_df[['name', 'country', 'date']],
        temp_oscar_df[['film','winner']],
        left_on='name',
        right_on='film')
    return countries_wins_merged_df

# We use this when we need the year of the Oscar ceremony, not when the film was made
def countries_oscar_year_merge(countries_movies_df, oscar_df):
    # Dropping the entries with null `film` values
    temp_oscar_df = oscar_df.dropna(subset=['film'], how='all')
    countries_wins_merged_df = pd.merge(
        countries_movies_df[['name', 'country']],
        temp_oscar_df[['film', 'winner', 'year_ceremony']],
        left_on='name',
        right_on='film')
    return countries_wins_merged_df

def countries_reviews_merge(countries_df, reviews_df):
    # Dropping the entries with null `movie_title` or 'review_score' values
    temp_reviews_df = reviews_df.dropna(subset=['movie_title', 'normalized_score'], how='any')

    countries_merged_df = pd.merge(
        countries_df[['name', 'country']],
        temp_reviews_df[['movie_title', 'normalized_score']],
        left_on='name',
        right_on='movie_title')
    return countries_merged_df

def genres_oscar_merge(genres_movies_df, oscar_df):
    # Dropping the entries with null `film` values
    temp_oscar_df = oscar_df.dropna(subset=['film'])

    genres_merged_df = pd.merge(
        genres_movies_df[['name', 'genre']],
        temp_oscar_df[['film', 'winner']],
        left_on='name',
        right_on='film')
    return genres_merged_df

def nom_win_number_c(countries_df):
    # Add a column to count each nomination explicitly
    countries_df['nominations'] = 1
    # Add a column that is 1 if the film won, 0 otherwise
    countries_df['wins'] = countries_df['winner'].astype(int)
    # Group by genre and aggregate nominations, wins, and win rate
    count_stats_df = countries_df.groupby('country').agg(
        Nominations=('nominations', 'sum'),
        Wins=('wins', 'sum')
    ).reset_index()
    return count_stats_df

def nom_win_number_g(genres_df):
    # Add a column to count each nomination explicitly
    genres_df['nominations'] = 1
    # Add a column that is 1 if the film won, 0 otherwise
    genres_df['wins'] = genres_df['winner'].astype(int)
    # Group by genre and aggregate nominations, wins, and win rate
    count_stats_df = genres_df.groupby('genre').agg(
        Nominations=('nominations', 'sum'),
        Wins=('wins', 'sum')
    ).reset_index()
    return count_stats_df

def genres_reviews_merge(genres_df, reviews_df):
    genres_reviews_df = pd.merge(
        genres_df,
        reviews_df[['movie_title', 'normalized_score']],
        left_on='name',
        right_on='movie_title',
        how='inner')
    return genres_reviews_df

def genres_countries_merge(genres_movies_df, countries_df):
    genres_countries_df = pd.merge(
        genres_movies_df,
        countries_df,
        on='id',
        how='inner')
    return genres_countries_df

def pivot_count_gen(genres_countries_df, reviews_df):
    # Selecting only the top 20 countries by number of films
    top_20_countries = genres_countries_df['country'].value_counts().nlargest(20).index
    filtered_df = genres_countries_df[genres_countries_df['country'].isin(top_20_countries)]

    final_filtered_df = pd.merge(
        filtered_df,
        reviews_df[['movie_title', 'normalized_score']],
        left_on='name',
        right_on='movie_title',
        how='inner')

    countries_grouped = (
        final_filtered_df
        .groupby(['country', 'genre'])['normalized_score']
        .mean()
        .reset_index()
    )
    # Pivot for heatmap
    pivot_df = countries_grouped.pivot(index='country', columns='genre', values='normalized_score')
    return pivot_df

def map_data_rev(oscar_df, reviews_df):
    oscar_wins = oscar_df[oscar_df['winner']].groupby('film').size().reset_index(name='wins')
    oscar_nominations = oscar_df.groupby('film').size().reset_index(name='nominations')
    review_scores = reviews_df.groupby('movie_title')['normalized_score'].mean().reset_index()

    # Merge datasets
    merged = pd.merge(oscar_nominations, oscar_wins, on='film', how='left')
    merged = pd.merge(merged, review_scores, left_on='film', right_on='movie_title', how='outer')
    merged['wins'] = merged['wins'].fillna(0)
    merged['nominations'] = merged['nominations'].fillna(0)
    merged['film'] = merged['film'].fillna(merged['movie_title'])

    # Top selections
    top_wins = merged.nlargest(10, 'wins')
    top_scores = merged.nlargest(10, 'normalized_score')

    # Combine and label
    combined = pd.concat([top_wins, top_scores])
    combined['Category'] = '🏆 Top 10 Oscar-Winning'
    combined.loc[combined['film'].isin(top_scores['film']), 'Category'] = '⭐ Top 10 Review-Scored'
    combined.loc[
        (combined['film'].isin(top_scores['film'])) &
        (combined['film'].isin(top_wins['film'])), 'Category'
    ] = '🏆⭐ Both'

    combined = combined.drop_duplicates(subset='film').copy()
    combined['film'] = combined['film'].str.title()
    combined['film_label'] = combined['Category'] + ' - ' + combined['film'] + '\t\t'

    return combined

def reviews_movies_merge(movies_df, reviews_df):
    movies_df = movies_df.copy()
    movies_df['minute'] = pd.to_numeric(movies_df['minute'], errors='coerce')
    movies_df = movies_df[movies_df['minute'] <= 800]  # Remove long-duration films

    merged_df = pd.merge(
        reviews_df,
        movies_df[['name', 'minute']],
        left_on='movie_title',
        right_on='name',
        how='inner'
    )

    # Step 4: Group by movie
    duration_grouped = merged_df.groupby('movie_title').agg(
        avg_score=('normalized_score', 'mean'),
        review_count=('normalized_score', 'count'),
        duration=('minute', 'first'),  # Keep original duration
        original_title=('movie_title', 'first')
    ).reset_index()
    # We will only work with films with >10 reviews
    duration_grouped = duration_grouped[duration_grouped['review_count'] >= 10]
    # Capitalize movie titles for display
    duration_grouped['original_title'] = duration_grouped['original_title'].str.title()
    return duration_grouped





# --- Visualisation ---
#Define the main palette we used in the visualisation file
def color_palette(df):
    cmap = plt.colormaps.get_cmap('viridis')
    colors = [cmap(i / len(df)) for i in range(len(df))]
    return colors

# Count the first 15 languages for number of films and then see
# how the change of the languages during the decades
def top15_language_trend(languages_df):
    top15_languages = languages_df['language'].value_counts().head(15).index
    filtered_df = languages_df.loc[languages_df['language'].isin(top15_languages)].copy()

    filtered_df.loc[:, 'year'] = filtered_df['date'].dt.year
    #Group by year and language, count the number of films
    lang_usage = filtered_df.groupby(['year', 'language']).size().reset_index(name='film_count')
    return lang_usage

def top15_director(crew_df):
    # Filter for the role 'Director'
    directors_df = crew_df[crew_df['role'].str.lower() == 'director']

    # Count the number of films for every director (Top 15)
    director_counts = directors_df['name'].value_counts().head(15)

    # Colors
    colors = sns.color_palette('viridis', len(director_counts))

    # Create chart
    plt.figure(figsize=(10, 8))

    # Vertical lines
    plt.vlines(
        x=director_counts.index,
        ymin=0,
        ymax=director_counts.values,
        color=colors,
        linewidth=2,
        alpha=0.7
    )

    # Marker
    plt.scatter(
        x=director_counts.index,
        y=director_counts.values,
        color=colors,
        s=100,
        zorder=3
    )
    # Spacing between dots and values
    spacing = 10  # Adjust this value to increase/decrease spacing

    # Adding the labels on the marker
    for i, value in enumerate(director_counts.values):
        plt.text(
            i,
            value + spacing,
            f'{value}',
            ha='center',
            va='bottom',
            fontsize=10,
            fontweight='bold'
        )

    # Titles and labels
    plt.title('Top 15 Directors by Number of Films', fontsize=16, weight='bold', pad=20)
    plt.xlabel('Director', fontsize=14)
    plt.ylabel('Number of Films', fontsize=14)
    plt.xticks(rotation=45, ha='right', fontsize=12)
    plt.grid(axis='y', linestyle='--', alpha=0.5)

    plt.tight_layout()
    plt.show()

def movie_rating_century(movies_df, after_2000=True):
    """
        This function creates a treemap that shows the distribution of film ratings
        based on the films released before or after the year 2000.
        If 'after_2000' is True, it counts films released after 2000,
        if False, it counts films released before 2000.
    """

    # Extract the year as an integer
    movies_df['year_int'] = movies_df['date'].dt.year

    # Filter for films based on 'after_2000'
    if after_2000:
        df_filtered = movies_df[movies_df['year_int'] >= 2000].copy()
    else:
        df_filtered = movies_df[movies_df['year_int'] < 2000].copy()

    # Gestione dei NaN e inf
    df_filtered.loc[:, 'rating'] = pd.to_numeric(df_filtered['rating'], errors='coerce')

    # Rimuovi eventuali NaN
    df_filtered = df_filtered.dropna(subset=['rating'])

    # Round ratings to the nearest integer for binning
    df_filtered['rating_rounded'] = df_filtered['rating'].round().astype(int)

    # Count the number of films per rating
    rating_counts = df_filtered['rating_rounded'].value_counts().sort_index()

    # Colori distinti per ogni fetta
    colors = sns.color_palette('viridis', len(rating_counts))

    # Crea le etichette con le percentuali
    labels = [f"{rating}\n{count} films\n{count / rating_counts.sum() * 100:.1f}%"
              for rating, count in zip(rating_counts.index, rating_counts.values)]

    # Creazione della treemap
    plt.figure(figsize=(6, 6))
    squarify.plot(
        sizes=rating_counts.values,
        label=labels,
        color=colors,
        alpha=0.8,
        pad=True,
        text_kwargs={'fontsize': 12, 'weight': 'bold', 'color': 'black'}
    )

    # Titolo dinamico in base al periodo selezionato
    if after_2000:
        plt.title('Rating Distribution After 2000', fontsize=16, weight='bold')
    else:
        plt.title('Rating Distribution Before 2000', fontsize=16, weight='bold')

    plt.axis('off')
    plt.tight_layout()
    plt.show()

def plot_most_common_genre_theatrical(releases_df, genres_df):
    """
    This function creates a chart that shows the most common genres released in 'Theatrical' release type.
    """

    # Step 1: Filter releases for 'Theatrical' type
    theatrical_releases = releases_df[releases_df['type'] == 'Theatrical']

    # Step 2: Merge releases_df with genres_df to get genres for theatrical films
    merged_df = pd.merge(theatrical_releases, genres_df, on='id', how='inner')

    # Step 3: Count the occurrences of each genre
    genre_counts = merged_df['genre'].value_counts()

    # Step 4: Create a bar chart for the most common genres
    plt.figure(figsize=(10, 6))
    genre_counts.plot(kind='bar', edgecolor='black')

    # Title and labels
    plt.title('Most Common Genres Released in Theatrical', fontsize=16)
    plt.xlabel('Genre', fontsize=14)
    plt.ylabel('Number of Films', fontsize=14)

    # Show the plot
    plt.tight_layout()
    plt.show()

def top_studios_lollipop_chart(studios_df):
    """
    This function displays a lollipop chart of the top 15 studios that produced the most films.
    """
    # Count the number of films produced by each studio
    studio_counts = studios_df['studio'].value_counts().head(15).sort_values()

    # Create the figure
    plt.figure(figsize=(12, 8))

    # Define colors using a palette
    colors = sns.color_palette('viridis', len(studio_counts))

    # Plot the sticks
    plt.hlines(y=studio_counts.index, xmin=0, xmax=studio_counts.values, color='grey', alpha=0.7, linewidth=2)

    # Plot the lollipops
    plt.scatter(studio_counts.values, studio_counts.index, color=colors, s=100, zorder=2, edgecolor='black')

    # Title and labels
    plt.title('Top 15 Studios by Number of Films Produced', fontsize=16, weight='bold', pad=20)
    plt.xlabel('Number of Films', fontsize=14)
    plt.ylabel('Studio', fontsize=14)

    # Show the grid for better readability
    plt.grid(axis='x', linestyle='--', alpha=0.5)

    # Adjust layout to avoid clipping
    plt.tight_layout()
    plt.show()

def bbc_rating_trend(studios_df, movies_df):
    """
    This function creates a line-column chart showing:
    - The average rating of BBC films by decade (line plot)
    - The number of films produced by BBC per decade (bar plot)
    """

    # Filter for BBC-produced films
    bbc_ids = studios_df[studios_df['studio'].str.contains('BBC', case=False, na=False)]['id']
    bbc_movies = movies_df[movies_df['id'].isin(bbc_ids)].copy()

    # Ensure date is in datetime format
    bbc_movies['date'] = pd.to_datetime(bbc_movies['date'], errors='coerce')

    # Remove rows with missing or NaT dates
    bbc_movies = bbc_movies.dropna(subset=['date'])

    # Extract the release year and decade
    bbc_movies['year'] = bbc_movies['date'].dt.year
    bbc_movies['decade'] = (bbc_movies['year'] // 10) * 10

    # Calculate average rating per decade
    decade_avg_rating = bbc_movies.groupby('decade')['rating'].mean()
    # Count the number of films per decade
    decade_count = bbc_movies['decade'].value_counts().sort_index()

    # Plotting
    fig, ax1 = plt.subplots(figsize=(14, 8))

    # Bar plot - Number of Films
    bars = ax1.bar(
        decade_count.index,
        decade_count.values,
        color='skyblue',
        alpha=0.7,
        label='Number of Films',
        width=8,
        zorder=2
    )

    ax1.set_ylabel('Number of Films', fontsize=14, labelpad=10)
    ax1.set_xlabel('Decade', fontsize=14, labelpad=10)
    ax1.set_xticks(decade_count.index)
    ax1.set_xticklabels(decade_count.index, rotation=45)
    ax1.grid(alpha=0.3, linestyle='--', zorder=1)

    # Line plot - Average Rating
    ax2 = ax1.twinx()
    ax2.plot(
        decade_avg_rating.index,
        decade_avg_rating.values,
        marker='o',
        linestyle='-',
        linewidth=2,
        color='orange',
        label='Average Rating',
        zorder=3
    )
    ax2.set_ylabel('Average Rating', fontsize=14, labelpad=10)
    ax2.set_ylim(0, 10)  # Assuming rating scale is 0-10

    # Adding labels to the line chart points
    for x, y in zip(decade_avg_rating.index, decade_avg_rating.values):
        ax2.text(x, y + 0.1, f"{y:.2f}", ha='center', fontsize=10, alpha=0.8)

    # Title and layout adjustments
    plt.title('BBC Film Ratings and Production Count by Decade', fontsize=16, weight='bold', pad=20, loc='left')
    fig.tight_layout()
    plt.show()
