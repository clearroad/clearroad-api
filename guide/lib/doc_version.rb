DOCS_PATH = "#{File.expand_path('.')}/source/includes/generated".freeze
VERSIONS_PATH = "/#{DOCS_PATH}/_versions".freeze

def render_versions
  markdown = Redcarpet::Markdown.new(NestingUniqueHeadCounter, {
    fenced_code_blocks: true,
    smartypants: true,
    disable_indented_code_blocks: true,
    prettify: true,
    strikethrough: true,
    tables: true,
    with_toc_data: true,
    no_intra_emphasis: true
  })
  return nil unless File.directory? VERSIONS_PATH

  Dir.entries(VERSIONS_PATH).reject { |f| File.directory? f }.map do |version|
    path = "#{VERSIONS_PATH}/#{version}/ClearRoad/README.md"
    readme = File.read(path)
    id = version.gsub('.', '-')
    content = markdown.render(readme)
      .gsub('id="api-reference-clearroad', "id=\"v#{id}-clearroad")
      .gsub("id='api-reference-clearroad", "id='v#{id}-clearroad")
      .gsub('href="#api-reference-clearroad', "href=\"#v#{id}-clearroad")
      .gsub("href='#api-reference-clearroad", "href='#v#{id}-clearroad")

    "<h1 id=\"v#{id}\">" \
      "<span>v#{version}</span><small class=\"toggle-version\" style=\"float:right\">Show</small></h1>" \
      '<p>This content is hidden by default. Click on "Show" above or in the menu to view it.</p>' \
      "<div id=\"#{id}\" class=\"content hidden\">#{content}</div>"
  end.join('\n')
end
