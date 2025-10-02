using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SuperOffice.DocsNext.Extensions
{
    public static class StringExtensions
    {
        /// <summary>
        /// Converts the language code to the full language name (e.g. en or english to English, da or danish to Danish).
        /// </summary>
        /// <param name="languageCode">The two character language code.</param>
        /// <returns>The full language name.</returns>
        public static string ToLanguageName(this string languageCode)
        {
            if (string.IsNullOrWhiteSpace(languageCode))
                return "English";

            return languageCode.ToLowerInvariant().Trim() switch
            {
                "da" or "danish" => "Danish",
                "nl" or "dutch" => "Dutch",
                "en" or "en-us" or "english" => "English",
                "de" or "german" => "German",
                "no" or "nb" or "norwegian" => "Norwegian",
                "sv" or "swedish" => "Swedish",
                _ => "English" // Return the original code if no match found
            };
        }
    }
}
