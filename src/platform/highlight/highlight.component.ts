import {
  Component,
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  SecurityContext,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
  TemplateRef,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTooltip } from '@angular/material/tooltip';
import { ICopyCodeTooltips } from '.';

declare const require: any;
/* tslint:disable-next-line */
let hljs: any = require('highlight.js/lib');

@Component({
  selector: 'td-highlight',
  styleUrls: ['./highlight.component.scss'],
  templateUrl: './highlight.component.html',
})
export class TdHighlightComponent implements AfterViewInit, AfterViewChecked {
  private _initialized: boolean = false;

  private _content: string;
  private _lang: string = 'typescript';

  /**
   * content?: string
   *
   * Code content to be parsed as highlighted html.
   * Used to load data dynamically.
   *
   * e.g. `.html`, `.ts` , etc.
   */
  @Input('content')
  set content(content: string) {
    this._content = content;
    if (this._initialized) {
      this._loadContent(this._content);
    }
  }

  /**
   * copyCodeToClipboard?: boolean
   *
   * Display copy button on code snippets to copy code to clipboard.
   */
  @Input() copyCodeToClipboard: boolean = false;

  /**
   * copyCodeTooltips?: ICopyCodeTooltips
   *
   * Tooltips for copy button to copy and upon copying.
   */
  @Input() copyCodeTooltips: ICopyCodeTooltips = {};

  /**
   * lang?: string
   *
   * Language of the code content to be parsed as highlighted html.
   * Defaults to `typescript`
   *
   * e.g. `typescript`, `html` , etc.
   */

  @Input('codeLang')
  set codeLang(lang: string) {
    this.setLanguage(lang);
  }
  /** @deprecated */
  @Input()
  set lang(lang: string) {
    this.setLanguage(lang);
  }

  copyContent: string;

  /**
   * contentReady?: function
   * Event emitted after the highlight content rendering is finished.
   */
  @Output() contentReady: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('highlightComponent') highlightComp: ElementRef;
  @ViewChild('copyComponent') copyComp: ElementRef;

  @ViewChild('tooltip') tooltip: MatTooltip;

  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    private _domSanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    if (!this._content) {
      this._loadContent((<HTMLElement>this.highlightComp.nativeElement).textContent);
    } else {
      this._loadContent(this._content);
    }
    this._initialized = true;
  }

  setLanguage(lang: string) {
    if (!lang) {
      throw new Error('Error: language attribute must be defined in TdHighlightComponent.');
    }
    this._lang = lang;
    if (this._initialized) {
      this._loadContent(this._content);
    }
  }

  /**
   * General method to parse a string of code into HTML Elements and load them into the container
   */
  private _loadContent(code: string): void {
    if (code && code.trim().length > 0) {
      // Clean container
      this._renderer.setProperty(this._elementRef.nativeElement, 'innerHTML', '');
      // Parse html string into actual HTML elements.
      this._elementFromString(this._render(code));
      if (this.copyCodeToClipboard) {
        this._renderer.appendChild(this._elementRef.nativeElement, this.copyComp.nativeElement);
      }
    }
    this.contentReady.emit();
  }

  private _elementFromString(codeStr: string): HTMLPreElement {
    // Renderer2 doesnt have a parsing method, so we have to sanitize and use [innerHTML]
    // to parse the string into DOM element for now.
    const preElement: HTMLPreElement = this._renderer.createElement('pre');
    this._renderer.appendChild(this._elementRef.nativeElement, preElement);
    const codeElement: HTMLElement = this._renderer.createElement('code');
    this._renderer.appendChild(preElement, codeElement);
    // Set .highlight class into <code> element
    this._renderer.addClass(codeElement, 'highlight');
    codeElement.innerHTML = this._domSanitizer.sanitize(SecurityContext.HTML, codeStr);
    return preElement;
  }

  private _render(contents: string): string {
    // Trim leading and trailing newlines
    contents = contents.replace(/^(\s|\t)*\n+/g, '').replace(/(\s|\t)*\n+(\s|\t)*$/g, '');
    // Split markup by line characters
    let lines: string[] = contents.split('\n');

    // check how much indentation is used by the first actual code line
    const firstLineWhitespace: string = lines[0].match(/^(\s|\t)*/)[0];

    // Remove all indentation spaces so code can be parsed correctly
    const startingWhitespaceRegex: RegExp = new RegExp('^' + firstLineWhitespace);
    lines = lines.map(function (line: string): string {
      return line
        .replace('=""', '') // remove empty values
        .replace(startingWhitespaceRegex, '')
        .replace(/\s+$/, ''); // remove trailing white spaces
    });

    const codeToParse: string = lines
      .join('\n')
      .replace(/\{ \{/gi, '{{')
      .replace(/\} \}/gi, '}}')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>'); // replace with < and > to render HTML in Angular
    this.copyContent = codeToParse;
    // Parse code with highlight.js depending on language
    const highlightedCode: any = hljs.highlight(this._lang, codeToParse, true);
    highlightedCode.value = highlightedCode.value
      .replace(/=<span class="hljs-value">""<\/span>/gi, '')
      .replace('<head>', '')
      .replace('<head/>', '');
    return highlightedCode.value;
  }
}
