import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import squarify

def top15_language_trend(movies_df, languages_df):
    languages_movies_df = pd.merge(movies_df[['id','date']], languages_df[['id', 'language']], on='id', how='inner')

    top15_languages = languages_movies_df['language'].value_counts().head(15).index

    filtered_df = languages_movies_df.loc[languages_movies_df['language'].isin(top15_languages)].copy()

    filtered_df.loc[:, 'year'] = filtered_df['date'].dt.year

    #Group by year and language, count the number of films
    lang_usage = filtered_df.groupby(['year', 'language']).size().reset_index(name='film_count')
    return lang_usage

def top14_language_trend(movies_df, languages_df):
    languages_movies_df = pd.merge(movies_df[['id','date']], languages_df[['id', 'language']], on='id', how='inner')

    top15_languages = languages_movies_df['language'].value_counts().head(15).index
    top14_languages = top15_languages[1:]

    filtered_df = languages_movies_df.loc[languages_movies_df['language'].isin(top14_languages)].copy()

    filtered_df.loc[:, 'year'] = filtered_df['date'].dt.year

    #Group by year and language, count the number of films
    lang_usage = filtered_df.groupby(['year', 'language']).size().reset_index(name='film_count')
    return lang_usage

def countries_oscar_merged(movies_df, countries_df, oscar_df):
    countries_movies_df = pd.merge(movies_df[['id', 'name']], countries_df[['id', 'country']], on='id', how='inner')
    # Dropping the entries with null `film` values
    temp_oscar_df = oscar_df.dropna(subset=['film'], how='all')
    countries_wins_merged_df = pd.merge(countries_movies_df[['name', 'country']], temp_oscar_df[['film','winner']],
                                   left_on='name', right_on='film')
    return countries_wins_merged_df

def countries_reviews_merged(movies_df, countries_df, reviews_df):
    countries_movies_df = pd.merge(movies_df[['id', 'name']], countries_df[['id', 'country']], on='id', how='inner')
    # Dropping the entries with null `movie_title` or 'review_score' values
    temp_reviews_df = reviews_df.dropna(subset=['movie_title', 'normalized_score'], how='any')

    countries_merged_df = pd.merge(countries_movies_df[['name', 'country']],
                                   temp_reviews_df[['movie_title', 'normalized_score']], left_on='name',
                                   right_on='movie_title')
    return countries_merged_df

def genres_oscar_merged(movies_df, oscar_df, genres_df):
    genres_movies_df = pd.merge(movies_df[['id', 'name']], genres_df[['id', 'genre']], on='id', how='inner')
    # Dropping the entries with null `film` values
    temp_oscar_df = oscar_df.dropna(subset=['film'])
    genres_merged_df = pd.merge(genres_movies_df[['name', 'genre']], temp_oscar_df[['film', 'winner']],
                                left_on='name', right_on='film')
    return genres_merged_df

def oscar_reviews_merged(movies_df, oscar_df, reviews_df):
    temp_oscar_df = oscar_df.dropna(subset=['film'])
    reviews_merged_df = pd.merge(reviews_df[['movie_title', 'normalized_score']], temp_oscar_df[['film', 'winner']],
                                left_on='movie_title', right_on='film')
    return reviews_merged_df

#Define the main palette we used in the visualisation file
def color_palette(df):
    cmap = plt.colormaps.get_cmap('viridis')
    colors = [cmap(i / len(df)) for i in range(len(df))]
    return colors

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
        df_filtered = movies_df[movies_df['year_int'] > 2000].copy()
    else:
        df_filtered = movies_df[movies_df['year_int'] <= 2000].copy()

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
    plt.figure(figsize=(10, 8))
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
        plt.title('Distribuzione delle valutazioni dei film (Dopo il 2000)', fontsize=16, weight='bold')
    else:
        plt.title('Distribuzione delle valutazioni dei film (Prima del 2000)', fontsize=16, weight='bold')

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
    genre_counts.plot(kind='bar', color='skyblue', edgecolor='black')

    # Title and labels
    plt.title('Most Common Genres Released in Theatrical', fontsize=16)
    plt.xlabel('Genre', fontsize=14)
    plt.ylabel('Number of Films', fontsize=14)

    # Show the plot
    plt.tight_layout()
    plt.show()