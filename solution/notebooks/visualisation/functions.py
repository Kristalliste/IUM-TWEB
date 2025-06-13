import pandas as pd
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import plotly.express as px
import seaborn as sns
import squarify

# --- AnalysisReport ---
# Merges movie titles with their languages based on the movie ID
def language_movies_merge(languages_df, movies_df):
    languages_movies_df = pd.merge(
        movies_df[['id', 'name', 'date']],
        languages_df[['id', 'language']],
        on='id',
        how='inner')
    return languages_movies_df

# Merges movie titles with their countries based on the movie ID
def countries_movies_merge(countries_df, movies_df):
    countries_movies_df = pd.merge(
        movies_df[['id', 'name', 'date']],
        countries_df[['id', 'country']],
        on='id',
        how='inner')
    return countries_movies_df

# Merges movie titles with their genres based on the movie ID
def genres_movies_merge(genres_df, movies_df):
    genres_movies_df = pd.merge(
        movies_df[['id', 'name', 'date']],
        genres_df[['id', 'genre']],
        on='id',
        how='inner')
    return genres_movies_df

# Merges country information with Oscar data based on film names, after removing rows with null film values
def countries_oscar_merge(countries_df, oscar_df):
    # Dropping the entries with null `film` values
    temp_oscar_df = oscar_df.dropna(subset=['film'], how='all')
    countries_wins_merged_df = pd.merge(
        countries_df[['name', 'country', 'date']],
        temp_oscar_df[['film','winner']],
        left_on='name',
        right_on='film')
    return countries_wins_merged_df

# Merges country-movie data with Oscar data (including ceremony year) for analysis by year
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

# Merges country data with reviews, keeping only entries that have both movie title and review score
def countries_reviews_merge(countries_df, reviews_df):
    # Dropping the entries with null `movie_title` or 'review_score' values
    temp_reviews_df = reviews_df.dropna(subset=['movie_title', 'normalized_score'], how='any')

    countries_merged_df = pd.merge(
        countries_df[['name', 'country']],
        temp_reviews_df[['movie_title', 'normalized_score']],
        left_on='name',
        right_on='movie_title')
    return countries_merged_df

# Merges genre-movie data with Oscar data to identify wins per genre
def genres_oscar_merge(genres_movies_df, oscar_df):
    # Dropping the entries with null `film` values
    temp_oscar_df = oscar_df.dropna(subset=['film'])

    genres_merged_df = pd.merge(
        genres_movies_df[['name', 'genre']],
        temp_oscar_df[['film', 'winner']],
        left_on='name',
        right_on='film')
    return genres_merged_df

# Calculates total Oscar nominations and wins per country
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

# Calculates total Oscar nominations and wins per genre
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

# Merges genre data with reviews based on movie titles
def genres_reviews_merge(genres_df, reviews_df):
    genres_reviews_df = pd.merge(
        genres_df,
        reviews_df[['movie_title', 'normalized_score']],
        left_on='name',
        right_on='movie_title',
        how='inner')
    return genres_reviews_df

# Merges genre-movie data with country data using movie IDs
def genres_countries_merge(genres_movies_df, countries_df):
    genres_countries_df = pd.merge(
        genres_movies_df,
        countries_df,
        on='id',
        how='inner')
    return genres_countries_df

# Merges language-movie data with reviews based on movie titles
def languages_reviews_merge(lang_movies_df, reviews_df):
    languages_reviews_df = pd.merge(
        lang_movies_df,
        reviews_df[['movie_title', 'normalized_score']],
        left_on='name',
        right_on='movie_title',
        how='inner')
    return languages_reviews_df

# Creates a pivot table of average review scores by genre and country, limited to top 20 countries
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

# Combines Oscar and review data for top-rated and most-winning films and creates heatmaps
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
    map_data_df = pd.concat([top_wins, top_scores])
    map_data_df['Category'] = '🏆 Top 10 Oscar-Winning'
    map_data_df.loc[map_data_df['film'].isin(top_scores['film']), 'Category'] = '⭐ Top 10 Review-Scored'
    map_data_df.loc[
        (map_data_df['film'].isin(top_scores['film'])) &
        (map_data_df['film'].isin(top_wins['film'])), 'Category'
    ] = '🏆⭐ Both'

    map_data_df = map_data_df.drop_duplicates(subset='film').copy()
    map_data_df['film'] = map_data_df['film'].str.title()
    map_data_df['film_label'] = map_data_df['Category'] + ' - ' + map_data_df['film'] + '\t\t'

    # Prepare heatmap data
    z_nominations = map_data_df[['nominations']].values
    z_wins = map_data_df[['wins']].values
    z_scores = map_data_df[['normalized_score']].values
    y_labels = map_data_df['film_label'].tolist()

    # 3 Heatmaps
    fig = go.Figure()
    # Nominations heatmap
    fig.add_trace(go.Heatmap(z=z_nominations, x=['Nominations'], y=y_labels, text=z_nominations.astype(str),
                             texttemplate="%{text}", colorscale='Viridis',
                             colorbar=dict(title='Oscar Nominations', len=0.3, y=0.85), hoverinfo='skip'))

    # Wins heatmap
    fig.add_trace(go.Heatmap(z=z_wins, x=['Oscar Wins'], y=y_labels, text=z_wins.astype(str), texttemplate="%{text}",
                             colorscale='Viridis', colorbar=dict(title='Oscar Wins', len=0.3, y=0.5), xaxis='x2', yaxis='y2',
                             hoverinfo='skip'))

    # Review scores heatmap
    fig.add_trace(go.Heatmap(z=z_scores, x=['Review Score'], y=y_labels, text=z_scores.round(2).astype(str),
                             texttemplate="%{text}", colorscale='Viridis',
                             colorbar=dict(title='Review Score', len=0.3, y=0.15), xaxis='x3', yaxis='y3',
                             hoverinfo='skip'))

    fig.update_layout(xaxis=dict(domain=[0, 0.25]), yaxis=dict(domain=[0, 1], showticklabels=True),
                      xaxis2=dict(domain=[0.35, 0.6]), yaxis2=dict(domain=[0, 1], showticklabels=False),
                      xaxis3=dict(domain=[0.7, 0.95]), yaxis3=dict(domain=[0, 1], showticklabels=False),
                      height=800,
                      width=1150,
                      title='Heatmaps of Nominations, Wins, and Review Scores for Top Films',
                      margin=dict(l=200)
                      )
    fig.show()

# Merges movie duration with reviews and filters out very long films, then aggregates review stats
def duration_merge(movies_df, reviews_df):
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

    # Group by movie
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

# Merges reviews with movie data to track average score and runtime trends over time
def reviews_movies_merge(movies_df, reviews_df):
    movies_df = movies_df.dropna(subset=['date', 'rating', 'minute'])
    merged_df = pd.merge(
        reviews_df,
        movies_df[['name', 'minute', 'date']],
        left_on='movie_title',
        right_on='name',
        how='inner'
    )
    #  Grouping by year and calculating means
    agg_time_df = merged_df.groupby('date').agg({
        'normalized_score': 'mean',
        'minute': 'mean'
    }).reset_index()

    return agg_time_df

# Creates violin plots of review score distribution across different genres
def genres_reviews_violin(genres_reviews_df):
    unique_genres = sorted(genres_reviews_df['genre'].dropna().unique())
    first_half = unique_genres[:9]
    second_half = unique_genres[9:]
    plot_df1 = genres_reviews_df[genres_reviews_df['genre'].isin(first_half)]
    plot_df2 = genres_reviews_df[genres_reviews_df['genre'].isin(second_half)]

    fig, axes = plt.subplots(2, 1, figsize=(12, 12))
    # First plot (First 9 genres) on the first axis (axes[0])
    sns.violinplot(
        x='genre',
        y='normalized_score',
        data=plot_df1,
        inner='quart',
        hue='genre',
        palette='cubehelix',
        ax=axes[0]
    )
    axes[0].set_title('Rotten Tomatoes Scores by Genre (1–9)', fontsize=14)
    axes[0].set_xlabel('Genre', fontsize=12)
    axes[0].set_ylabel('Normalized Score (out of 10)', fontsize=12)
    axes[0].tick_params(axis='x', rotation=45)

    # Second plot (Next 9 genres) on the second axis (axes[1])
    sns.violinplot(
        x='genre',
        y='normalized_score',
        data=plot_df2,
        inner='quart',
        hue='genre',
        palette='cubehelix',
        ax=axes[1]
    )
    axes[1].set_title('Rotten Tomatoes Scores by Genre (10–18)', fontsize=14)
    axes[1].set_xlabel('Genre', fontsize=12)
    axes[1].set_ylabel('Normalized Score (out of 10)', fontsize=12)
    axes[1].tick_params(axis='x', rotation=45)

    plt.tight_layout()
    plt.show()

# Creates a bar plot of average review scores per genre
def genres_reviews_bar(genres_reviews_df):
    genre_avg_scores = genres_reviews_df.groupby('genre')['normalized_score'].mean().sort_values(ascending=False)

    # Bar plot
    plt.figure(figsize=(10, 6))
    sns.barplot(
        x=genre_avg_scores.index,
        y=genre_avg_scores.values,
        hue=genre_avg_scores.index,
        palette='viridis'
    )

    plt.title('Average Rotten Tomatoes Score by Genre', fontsize=16)
    plt.xlabel('Genre', fontsize=12)
    plt.ylabel('Average Score (out of 10)', fontsize=12)
    plt.xticks(rotation=45)
    plt.ylim(0, 10)
    plt.tight_layout()
    plt.show()

# Plots a line graph showing average review scores per genre over time
def avg_score_genres(genres_reviews_df):
    temp_gen_rev_df = genres_reviews_df
    # Extract year from date
    temp_gen_rev_df['year'] = genres_reviews_df['date'].dt.year

    genres_grouped_df = (
        temp_gen_rev_df
        .groupby(['year', 'genre'])['normalized_score']
        .mean()
        .reset_index())

    fig = px.line(
        genres_grouped_df,
        x='year',
        y='normalized_score',
        color='genre',
        title="Average Rotten Tomatoes Score by Genre Over Time",
        labels={
            'normalized_score': 'Average Score',
            'year': 'Year',
            'genre': 'Genre'},
        markers=True
    )

    fig.update_traces(line=dict(width=1))  # thinner lines
    fig.update_layout(
        height=500,
        title_font=dict(size=20),
        legend_title_text='Genre',
        yaxis=dict(range=[1, 10])
    )
    fig.show()

# Analyzes language trends among top-reviewed films over time and plots them
def top_language_trend(languages_df, movies_df, reviews_df, num_lang=15, num_films=10000):
    lang_movies_df = language_movies_merge(languages_df, movies_df)
    lang_rev_df = languages_reviews_merge(lang_movies_df, reviews_df)

    # Select top num_films movies by normalized_score
    top_films_df = lang_rev_df.nlargest(num_films, 'normalized_score').copy()

    # Identify top num_lang languages within this subset
    top15_languages = top_films_df['language'].value_counts().head(num_lang).index

    # Filter for only top languages
    filtered_df = top_films_df[top_films_df['language'].isin(top15_languages)].copy()

    filtered_df.loc[:, 'year'] = filtered_df['date'].dt.year
    filtered_df = filtered_df[filtered_df['year'] < 2024]

    lang_usage = filtered_df.groupby(['year', 'language']).size().reset_index(name='film_count')

    fig = px.line(lang_usage,
                  x='year',
                  y='film_count',
                  color='language',
                  title="Top 15 Language Usage in Films Over Time",
                  labels={'film_count': 'Number of Films', 'year': 'Year', 'language': 'Language'},
                  markers=True)
    fig.show()




# --- Visualisation ---
#Define the main palette we used in the visualisation file
def color_palette(df):
    cmap = plt.colormaps.get_cmap('viridis')
    colors = [cmap(i / len(df)) for i in range(len(df))]
    return colors

# Count the first 15 languages for number of films and then see their trend over time
def top15_language_trend(languages_df,num_lang=15):
    top15_languages = languages_df['language'].value_counts().head(num_lang).index
    filtered_df = languages_df.loc[languages_df['language'].isin(top15_languages)].copy()

    filtered_df.loc[:, 'year'] = filtered_df['date'].dt.year
    filtered_df = filtered_df[filtered_df['year'] < 2024]

    #Group by year and language, count the number of films
    lang_usage = filtered_df.groupby(['year', 'language']).size().reset_index(name='film_count')
    return lang_usage

# Visualizes the top 15 directors by number of films using a bar-like lollipop chart
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


def movie_rating_century(movies_df):
    """
    This function creates a treemap that shows the distribution of film ratings
    based on the films released before and after the year 2000.
    """
    fig, axes = plt.subplots(1, 2, figsize=(14, 7))

    # Before 2000
    df_before = movies_df[movies_df['date'].dt.year < 2000].copy()
    df_before.loc[:, 'rating'] = pd.to_numeric(df_before['rating'], errors='coerce')
    df_before = df_before.dropna(subset=['rating'])
    df_before['rating_rounded'] = df_before['rating'].round().astype(int)

    rating_counts_before = df_before['rating_rounded'].value_counts().sort_index()
    colors_before = sns.color_palette('viridis', len(rating_counts_before))

    labels_before = [f"{rating}\n{count} films\n{count / rating_counts_before.sum() * 100:.1f}%"
                     for rating, count in zip(rating_counts_before.index, rating_counts_before.values)]

    squarify.plot(sizes=rating_counts_before.values,label=labels_before, color=colors_before, alpha=0.8,
                  pad=True, text_kwargs={'fontsize': 12, 'weight': 'bold', 'color': 'black'}, ax=axes[0]
    )

    axes[0].set_title('Rating Distribution Before 2000', fontsize=16, weight='bold')
    axes[0].axis('off')

    # After 2000
    df_after = movies_df[movies_df['date'].dt.year >= 2000].copy()
    df_after.loc[:, 'rating'] = pd.to_numeric(df_after['rating'], errors='coerce')
    df_after = df_after.dropna(subset=['rating'])
    df_after['rating_rounded'] = df_after['rating'].round().astype(int)

    rating_counts_after = df_after['rating_rounded'].value_counts().sort_index()
    colors_after = sns.color_palette('viridis', len(rating_counts_after))

    labels_after = [f"{rating}\n{count} films\n{count / rating_counts_after.sum() * 100:.1f}%"
                    for rating, count in zip(rating_counts_after.index, rating_counts_after.values)]

    squarify.plot(
        sizes=rating_counts_after.values, label=labels_after, color=colors_after, alpha=0.8,
        pad=True, text_kwargs={'fontsize': 12, 'weight': 'bold', 'color': 'black'}, ax=axes[1]
    )

    axes[1].set_title('Rating Distribution After 2000', fontsize=16, weight='bold')
    axes[1].axis('off')
    plt.tight_layout()
    plt.show()

def plot_most_common_genre_theatrical(releases_df, genres_df):
    """
    This function creates a chart that shows the most common genres released in 'Theatrical' release type.
    """
    theatrical_releases = releases_df[releases_df['type'] == 'Theatrical']
    merged_df = pd.merge(theatrical_releases, genres_df, on='id', how='inner')

    genre_counts = merged_df['genre'].value_counts()

    plt.figure(figsize=(10, 6))
    genre_counts.plot(kind='bar', edgecolor='black')

    plt.title('Most Common Genres Released in Theatrical', fontsize=16)
    plt.xlabel('Genre', fontsize=14)
    plt.ylabel('Number of Films', fontsize=14)

    plt.tight_layout()
    plt.show()

def top_studios_lollipop_chart(studios_df):
    """
    This function displays a lollipop chart of the top 15 studios that produced the most films.
    """
    # Count the number of films produced by each studio
    studio_counts = studios_df['studio'].value_counts().head(15).sort_values()

    plt.figure(figsize=(12, 8))
    colors = sns.color_palette('viridis', len(studio_counts))
    plt.hlines(y=studio_counts.index, xmin=0, xmax=studio_counts.values, color='grey', alpha=0.7, linewidth=2)

    # Lollipop plot
    plt.scatter(studio_counts.values, studio_counts.index, color=colors, s=100, zorder=2, edgecolor='black')

    plt.title('Top 15 Studios by Number of Films Produced', fontsize=16, weight='bold', pad=20)
    plt.xlabel('Number of Films', fontsize=14)
    plt.ylabel('Studio', fontsize=14)
    plt.grid(axis='x', linestyle='--', alpha=0.5)

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
    ax2.set_ylim(0, 10)

    for x, y in zip(decade_avg_rating.index, decade_avg_rating.values):
        ax2.text(x, y + 0.1, f"{y:.2f}", ha='center', fontsize=10, alpha=0.8)

    plt.title('BBC Film Ratings and Production Count by Decade', fontsize=16, weight='bold', pad=20, loc='left')
    fig.tight_layout()
    plt.show()