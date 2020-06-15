/**
 * BSD 3-Clause License
 *
 * Copyright (c) 2020, Justin Lyon
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
import { LightningElement, api, track, wire } from 'lwc'
import { getPicklistValues } from 'lightning/uiObjectInfoApi'

const VARIANTS = [
  'standard',
  'label-hidden',
  'label-inline',
  'label-stacked'
]

export default class Picklist extends LightningElement {
  @api fieldDescribe
  @api recordTypeId
  @api default

  @api label
  @api fieldLevelHelp
  @api disabled = false
  @api required = false

  @track errors = []
  @track _variant
  @api
  get variant () { return this._variant }
  set variant (val) {
    if (!VARIANTS.includes(val)) throw new Error('Property variant expects values of ', VARIANTS.join(', '))

    this._variant = val
  }

  @track selected
  @track options

  @wire(getPicklistValues, { recordTypeId: '$recordTypeId', fieldApiName: '$fieldDescribe' })
  wiredPicklistValues ({ error, data }) {
    if (error) {
      this.errors.push(error)
      console.error('Error', error)
    } else if (data) {
      this.options = data.values.map(({ label, value }) => ({ label, value }))
      this.setDefaultSelected(data)
    }
  }

  setDefaultSelected ({ defaultValue }) {
    if (this.default) {
      this.selected = this.default
    } else if (defaultValue) {
      this.selected = defaultValue.value
    } else {
      this.selected = this.options[0].value
    }
  }

  onChange (event) {
    this.selected = event.target.value
    const selected = new CustomEvent('selected', {
      detail: this.selected
    })
    this.dispatchEvent(selected)
  }
}